import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  FolderHeart,
  Zap,
  ShoppingBag,
  MessageSquare,
  Flame,
  Search,
  Copy,
  ExternalLink,
  Crown,
  Layers,
} from 'lucide-react';
import { AdProject, UserAccount, AdInputs } from '../types';
import { SAMPLE_PRODUCTS } from '../data/samples';

interface DashboardProps {
  user: UserAccount;
  projects: AdProject[];
  onStartCreate: (prefill?: Partial<AdInputs>) => void;
  onOpenProject: (project: AdProject) => void;
  onOpenPlans: () => void;
  onCopyText: (text: string, label: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  projects,
  onStartCreate,
  onOpenProject,
  onOpenPlans,
  onCopyText,
}) => {
  const favoriteProjects = projects.filter(p => p.isFavorite);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 space-y-6 pb-20 overflow-y-auto">
      {/* Top Banner / Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/80 via-slate-900 to-slate-900 border border-indigo-500/30 p-5 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
                <Crown className="w-3 h-3 text-indigo-300" />
                {user.plan === 'pro' ? 'Pro Marketer' : user.plan === 'agency' ? 'Agency Unlimited' : 'Free Starter'}
              </span>
              {user.isGuest && (
                <span className="text-[11px] text-slate-400">· Guest Session</span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Turn Ideas Into Ads That Sell
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-md">
              Create platform-optimized headlines, captions, and complete campaigns with high-impact copywriting.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/60 backdrop-blur-sm border border-slate-800 p-2.5 rounded-2xl text-center min-w-[90px]">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">AI Credits</span>
              <span className="text-base font-extrabold text-white font-mono">{user.creditsRemaining}</span>
              <span className="text-[10px] text-indigo-400 block font-medium">available</span>
            </div>

            <button
              onClick={() => onStartCreate()}
              className="h-11 px-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create an Ad</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Action Category Tiles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 tracking-tight">Quick Advertising Actions</h3>
          <span className="text-xs text-slate-500">Pick a goal</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onStartCreate({ platform: 'instagram', objective: 'sales' })}
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
              Product Ad
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">High-CTR Instagram & FB</div>
          </button>

          <button
            onClick={() => onStartCreate({ platform: 'tiktok', objective: 'awareness' })}
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
              Viral TikTok Hook
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">3-second attention hooks</div>
          </button>

          <button
            onClick={() => onStartCreate({ platform: 'whatsapp', objective: 'leads', language: 'ur' })}
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
              WhatsApp Broadcast
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">English & Urdu direct sales</div>
          </button>

          <button
            onClick={() => onStartCreate({ platform: 'google_ads', objective: 'traffic' })}
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
              Google Ads Pack
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Search headlines & copy</div>
          </button>
        </div>
      </div>

      {/* Ready-to-Test Example Templates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-200 tracking-tight">Try Curated Demo Products</h3>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
              Instant 1-Click
            </span>
          </div>
          <span className="text-xs text-slate-500">Tap to load</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_PRODUCTS.map(sample => (
            <div
              key={sample.id}
              onClick={() => onStartCreate(sample.inputs)}
              className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all flex items-start gap-3.5 group"
            >
              <img
                src={sample.image}
                alt={sample.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700/80 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider truncate">
                    {sample.category}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0 font-medium">
                    {sample.inputs.platform.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-indigo-300 transition-colors">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {sample.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-indigo-300 font-semibold">
                  <span>Load into Generator</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent / Saved Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-200 tracking-tight">Recent Ad Projects</h3>
            <span className="text-xs text-slate-500">({projects.length})</span>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
            <FolderHeart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">No ads created yet</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
              Start by typing your product details or click any sample above to see AdGenius AI in action!
            </p>
            <button
              onClick={() => onStartCreate()}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create First Ad</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {projects.slice(0, 4).map(proj => (
              <div
                key={proj.id}
                className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => onOpenProject(proj)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-0.5">
                    <span className="font-semibold text-indigo-400 uppercase tracking-wide">
                      {proj.platform}
                    </span>
                    <span>·</span>
                    <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate hover:text-indigo-300 transition-colors">
                    {proj.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {proj.results.slogan || proj.results.headlines[0]}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onCopyText(proj.results.headlines[0], 'Top Headline')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy Top Headline"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenProject(proj)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold text-xs border border-indigo-500/30 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subscription Banner */}
      {user.plan === 'free' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-800/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Unlock Unlimited Ad Generations</h4>
              <p className="text-[11px] text-slate-400">Get priority Gemini AI copywriting and high-converting visual packs.</p>
            </div>
          </div>
          <button
            onClick={onOpenPlans}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs whitespace-nowrap shadow-md"
          >
            Upgrade Pro
          </button>
        </div>
      )}
    </div>
  );
};
