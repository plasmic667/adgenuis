import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Smartphone, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isPhoneMode: boolean;
  onToggleMode: (phoneMode: boolean) => void;
  appName?: string;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isPhoneMode,
  onToggleMode,
  appName = 'AdGenius AI',
}) => {
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      {/* Top Device Mode Toolbar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 py-2.5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-extrabold text-white text-sm tracking-wider">AG</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">{appName}</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Android Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Turn Ideas Into Ads That Sell</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onToggleMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isPhoneMode
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Android Phone Mockup"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Android View</span>
            </button>
            <button
              onClick={() => onToggleMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !isPhoneMode
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Desktop Studio Full Screen"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop Studio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full flex items-center justify-center p-0 md:p-6 lg:p-8">
        {isPhoneMode ? (
          // Realistic Android Phone Body
          <div className="relative my-2 md:my-4 transition-all duration-300">
            {/* Phone outer bezel */}
            <div className="w-[395px] sm:w-[420px] h-[850px] max-h-[92vh] bg-slate-900 rounded-[44px] p-3 shadow-2xl shadow-indigo-950/60 border-4 border-slate-800 ring-1 ring-slate-700/50 flex flex-col relative overflow-hidden">
              
              {/* Phone hardware buttons simulation */}
              <div className="absolute -left-[7px] top-28 w-[3px] h-12 bg-slate-700 rounded-l" />
              <div className="absolute -left-[7px] top-44 w-[3px] h-20 bg-slate-700 rounded-l" />
              <div className="absolute -right-[7px] top-36 w-[3px] h-14 bg-slate-700 rounded-r" />

              {/* Screen Inner Frame */}
              <div className="flex-1 bg-slate-950 rounded-[34px] overflow-hidden flex flex-col relative border border-slate-800/80">
                
                {/* Android Status Bar */}
                <div className="h-8 bg-slate-950/95 backdrop-blur-sm px-5 flex items-center justify-between text-xs font-semibold text-slate-300 select-none z-30 shrink-0">
                  <span className="text-[11px] tracking-wide text-slate-300">{currentTime}</span>
                  
                  {/* Punch Hole Camera Notch */}
                  <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-slate-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Signal className="w-3 h-3 text-slate-300" />
                    <Wifi className="w-3 h-3 text-slate-300" />
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] text-slate-300 font-mono">96%</span>
                      <Battery className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </div>
                </div>

                {/* Android App Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
                  {children}
                </div>

                {/* Android Gesture Bar */}
                <div className="h-5 bg-slate-950 flex items-center justify-center shrink-0 z-30">
                  <div className="w-32 h-1 bg-slate-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Full Screen Desktop Studio Mode
          <div className="w-full max-w-7xl mx-auto bg-slate-900/40 rounded-2xl border border-slate-800 shadow-xl overflow-hidden min-h-[820px] flex flex-col">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
