import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AdminUser, AuditLog } from '../types';
import bcrypt from 'bcryptjs';
import * as OTPAuth from 'otpauth';

interface AuthContextType {
  user: AdminUser | null;
  logs: AuditLog[];
  isLocked: boolean;
  lockoutTimeRemaining: number;
  requiresMfaSetup: boolean;
  mfaSecret: string | null; // Exposed only during setup
  login: (username: string, password: string, mfaToken: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  logAction: (action: string, details: string, severity?: 'INFO' | 'WARNING' | 'CRITICAL') => void;
  completeMfaSetup: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- SECURITY CONSTANTS ---
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 Minutes
const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 Minutes
const DEFAULT_USER = 'admin';
const DEFAULT_PASS_STRING = 'Titan-Defense-System-99!'; // Hard password
const STORAGE_KEYS = {
  AUTH_DATA: 'msis_sec_auth', // Stores hash
  MFA_SECRET: 'msis_sec_mfa', // Stores TOTP secret
  LOGS: 'msis_sec_audit',
  ATTEMPTS: 'msis_sec_attempts'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
  const [requiresMfaSetup, setRequiresMfaSetup] = useState(false);
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);

  // Fix: Use ReturnType<typeof setTimeout> to support browser environment (returns number)
  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    initializeSecurity();
    loadLogs();
    checkLockout();

    // Session Activity Monitor
    const resetTimer = () => {
      if (user) {
        if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
        sessionTimerRef.current = setTimeout(() => {
          logout();
          logAction('SYSTEM', 'Session expired due to inactivity', 'INFO');
        }, SESSION_TIMEOUT);
      }
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    };
  }, [user]);

  // --- SECURITY CORE ---

  const initializeSecurity = () => {
    const existingAuth = localStorage.getItem(STORAGE_KEYS.AUTH_DATA);
    if (!existingAuth) {
      // First run: Hash the default strong password
      const salt = bcrypt.genSaltSync(12);
      const hash = bcrypt.hashSync(DEFAULT_PASS_STRING, salt);
      localStorage.setItem(STORAGE_KEYS.AUTH_DATA, JSON.stringify({ username: DEFAULT_USER, hash }));
    }
  };

  const checkLockout = () => {
    const attemptData = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTEMPTS) || '{}');
    if (attemptData.lockoutUntil && attemptData.lockoutUntil > Date.now()) {
      setIsLocked(true);
      setLockoutTimeRemaining(Math.ceil((attemptData.lockoutUntil - Date.now()) / 1000));
      
      const interval = setInterval(() => {
        const remaining = attemptData.lockoutUntil - Date.now();
        if (remaining <= 0) {
          setIsLocked(false);
          setLockoutTimeRemaining(0);
          localStorage.removeItem(STORAGE_KEYS.ATTEMPTS); // Clear lockout
          clearInterval(interval);
        } else {
          setLockoutTimeRemaining(Math.ceil(remaining / 1000));
        }
      }, 1000);
      return true;
    }
    return false;
  };

  const registerFailedAttempt = () => {
    const attemptData = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTEMPTS) || '{"count": 0}');
    attemptData.count = (attemptData.count || 0) + 1;
    attemptData.lastAttempt = Date.now();

    if (attemptData.count >= MAX_ATTEMPTS) {
      attemptData.lockoutUntil = Date.now() + LOCKOUT_DURATION;
      setIsLocked(true);
      logAction('SECURITY', `System locked due to ${MAX_ATTEMPTS} failed login attempts.`, 'CRITICAL');
    }

    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attemptData));
  };

  const logAction = (action: string, details: string, severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO') => {
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      details,
      severity,
      ip: navigator.userAgent // Simulating IP tracking
    };
    const updatedLogs = [newLog, ...logs].slice(0, 100); // Keep last 100 logs
    setLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));
  };

  const loadLogs = () => {
    const savedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  };

  // --- AUTH OPERATIONS ---

  const login = async (username: string, password: string, mfaToken: string): Promise<{ success: boolean; message?: string }> => {
    if (checkLockout()) return { success: false, message: 'System Locked. Try again later.' };

    // 1. Username Check
    const storedAuth = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH_DATA) || '{}');
    if (username !== storedAuth.username) {
      registerFailedAttempt();
      // Generic error to prevent username enumeration
      return { success: false, message: 'Invalid credentials' };
    }

    // 2. Password Check (Async bcrypt)
    const isValidPass = await bcrypt.compare(password, storedAuth.hash);
    if (!isValidPass) {
      registerFailedAttempt();
      logAction('LOGIN_FAIL', `Failed login attempt for user: ${username}`, 'WARNING');
      return { success: false, message: 'Invalid credentials' };
    }

    // 3. MFA Check
    const storedMfaSecret = localStorage.getItem(STORAGE_KEYS.MFA_SECRET);
    
    if (!storedMfaSecret) {
      // First time login - Setup MFA
      const newSecret = new OTPAuth.Secret({ size: 20 });
      setMfaSecret(newSecret.base32);
      setRequiresMfaSetup(true);
      
      // We authenticate them temporarily to complete setup
      setUser({ username, isAuthenticated: false }); 
      return { success: true, message: 'MFA Setup Required' };
    }

    // Verify Token
    const totp = new OTPAuth.TOTP({
      issuer: 'MSIS_Admin',
      label: username,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(storedMfaSecret)
    });

    const delta = totp.validate({ token: mfaToken, window: 1 });

    if (delta === null) {
      registerFailedAttempt();
      logAction('MFA_FAIL', `Invalid MFA token for user: ${username}`, 'WARNING');
      return { success: false, message: 'Invalid 2FA Code' };
    }

    // Success
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS); // Reset attempts
    setUser({ username, isAuthenticated: true, lastLogin: new Date().toISOString() });
    logAction('LOGIN_SUCCESS', `User ${username} logged in successfully`, 'INFO');
    return { success: true };
  };

  const completeMfaSetup = () => {
    if (mfaSecret && user) {
      localStorage.setItem(STORAGE_KEYS.MFA_SECRET, mfaSecret);
      setRequiresMfaSetup(false);
      setMfaSecret(null);
      setUser({ ...user, isAuthenticated: true });
      logAction('MFA_SETUP', `MFA configured for user ${user.username}`, 'INFO');
    }
  };

  const logout = () => {
    if (user) {
      logAction('LOGOUT', `User ${user.username} logged out`, 'INFO');
    }
    setUser(null);
    setRequiresMfaSetup(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, logs, isLocked, lockoutTimeRemaining, 
      requiresMfaSetup, mfaSecret,
      login, logout, logAction, completeMfaSetup
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};