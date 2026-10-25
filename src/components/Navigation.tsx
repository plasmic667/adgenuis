import React from 'react';
import { Home, Sparkles, FolderHeart, Zap, User } from 'lucide-react';

export type TabType = 'home' | 'wizard' | 'projects' | 'plans' | 'profile';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedCount: number;
  creditsRemaining: number;
}

export const BottomNavigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  savedCount,
}) => {
  return (
    <nav className="h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 flex items-center justify-around z-40 select-none">
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
          activeTab === 'home' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Home</span>
      </button>

      <button
        onClick={() => onTabChange('projects')}
        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
          activeTab === 'projects' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <FolderHeart className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Saved Ads</span>
        {savedCount > 0 && (
          <span className="absolute top-2 right-6 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {savedCount}
          </span>
        )}
      </button>

      {/* Prominent Center "Create Ad" Action */}
      <button
        onClick={() => onTabChange('wizard')}
        className="flex flex-col items-center justify-center px-3 -mt-4 transition-transform active:scale-95"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/40 ring-4 ring-slate-950">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-[10px] font-bold text-indigo-300 mt-1">Create</span>
      </button>

      <button
        onClick={() => onTabChange('plans')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
          activeTab === 'plans' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Zap className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Pro Plan</span>
      </button>

      <button
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
          activeTab === 'profile' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Account</span>
      </button>
    </nav>
  );
};
