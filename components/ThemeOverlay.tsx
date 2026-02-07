import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { Moon, Star } from 'lucide-react';

const ThemeOverlay: React.FC = () => {
  const { siteSettings } = useStore();
  const { theme } = siteSettings;

  if (theme === 'default') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      
      {/* --- RAMADAN KAREEM THEME --- */}
      {theme === 'ramadan' && (
        <>
          {/* Hanging Lanterns (Left) */}
          <div className="absolute -top-10 left-10 md:left-20 animate-[swing_3s_ease-in-out_infinite] origin-top">
             <div className="w-1 h-32 bg-gradient-to-b from-[#1d1d1f] to-[#dba111]"></div>
             <div className="relative -ml-5">
                 <svg width="44" height="60" viewBox="0 0 24 24" fill="#dba111" className="drop-shadow-lg filter">
                    <path d="M12 2L15 8H9L12 2Z" />
                    <rect x="7" y="8" width="10" height="12" rx="2" />
                    <path d="M7 20L12 23L17 20" />
                 </svg>
                 <div className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full blur-md opacity-80 animate-pulse"></div>
             </div>
          </div>

          {/* Hanging Lanterns (Right) */}
          <div className="absolute -top-5 right-10 md:right-32 animate-[swing_4s_ease-in-out_infinite_reverse] origin-top">
             <div className="w-1 h-20 bg-gradient-to-b from-[#1d1d1f] to-[#dba111]"></div>
             <div className="relative -ml-4">
                <svg width="34" height="50" viewBox="0 0 24 24" fill="#dba111" className="drop-shadow-lg">
                    <path d="M12 2L15 8H9L12 2Z" />
                    <rect x="7" y="8" width="10" height="12" rx="2" />
                    <path d="M7 20L12 23L17 20" />
                 </svg>
                 <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full blur-md opacity-80 animate-pulse"></div>
             </div>
          </div>

          {/* Crescent Moon */}
          <div className="absolute top-20 right-[10%] opacity-20 rotate-[-15deg]">
             <Moon size={180} strokeWidth={1} className="text-[#dba111] drop-shadow-2xl" fill="rgba(219, 161, 17, 0.1)" />
          </div>

          {/* Islamic Pattern Overlay - Very subtle */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-multiply pointer-events-none"></div>
        </>
      )}

      {/* --- AID EL FITR / MAWLID THEME --- */}
      {(theme === 'eid' || theme === 'mawlid') && (
        <>
           <div className="absolute top-0 w-full h-full">
              <div className="absolute top-10 left-10 text-green-600/20 animate-pulse delay-75"><Star size={40} fill="currentColor" /></div>
              <div className="absolute top-32 right-20 text-green-600/20 animate-pulse delay-150"><Star size={24} fill="currentColor" /></div>
              <div className="absolute bottom-40 left-20 text-green-600/10 animate-pulse"><Moon size={60} /></div>
           </div>
           {theme === 'eid' && (
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-yellow-400 to-green-500"></div>
           )}
        </>
      )}

      {/* --- NEW YEAR THEME --- */}
      {theme === 'new_year' && (
        <>
            <div className="absolute top-10 left-[20%] w-2 h-2 bg-red-500 rounded-full animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            <div className="absolute top-24 right-[30%] w-3 h-3 bg-blue-500 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            <div className="absolute top-40 left-[50%] w-2 h-2 bg-yellow-400 rounded-full animate-[ping_1.2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            
            {/* Confetti effect using simple divs */}
            {Array.from({ length: 20 }).map((_, i) => (
                <div 
                    key={i}
                    className="absolute w-1.5 h-3 bg-gradient-to-b from-yellow-300 to-yellow-500"
                    style={{
                        top: -20,
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random(),
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animation: `fall ${Math.random() * 5 + 5}s linear infinite`
                    }}
                />
            ))}
        </>
      )}

      <style>{`
        @keyframes swing {
            0% { transform: rotate(5deg); }
            50% { transform: rotate(-5deg); }
            100% { transform: rotate(5deg); }
        }
        @keyframes fall {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 1;}
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0;}
        }
      `}</style>
    </div>
  );
};

export default ThemeOverlay;