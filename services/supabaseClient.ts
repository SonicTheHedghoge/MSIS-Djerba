import { createClient } from '@supabase/supabase-js';

// Fallback credentials provided by user
const FALLBACK_URL = "https://nhppysaygwpvwddefsma.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ocHB5c2F5Z3dwdndkZGVmc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTM1MDYsImV4cCI6MjA4NjAyOTUwNn0.h40mWhQuc3oe8KkAZNnQQHnDDwavC8dtrpXJDYa8jwk";

// Safe environment variable access
const getEnvVar = (key: string): string | undefined => {
  try {
    // Check import.meta.env (Vite standard)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    console.warn("Error accessing import.meta.env", e);
  }
  return undefined;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || FALLBACK_URL;
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || FALLBACK_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);