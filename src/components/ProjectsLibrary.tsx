import React, { useState } from 'react';
import {
  FolderHeart,
  Search,
  Heart,
  Trash2,
  Copy,
  ExternalLink,
  Plus,
  Filter,
  Sparkles,
} from 'lucide-react';
import { AdProject } from '../types';

interface ProjectsLibraryProps {
  projects: AdProject[];
  onOpenProject: (project: AdProject) => void;
  onDeleteProject: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCopyText: (text: string, label: string) => void;
  onCreateNew: () => void;
}

export const ProjectsLibrary: React.FC<ProjectsLibraryProps> = ({
  projects,
  onOpenProject,
  onDeleteProject,
  onToggleFavorite,
  onCopyText,
  onCreateNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'favorites' | 'instagram' | 'tiktok' | 'whatsapp' | 'google_ads'>('all');

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.inputs.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.results.headlines.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedFilter === 'favorites') return p.isFavorite;
    if (selectedFilter !== 'all') return p.platform === selectedFilter;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-slate-950 text-slate-100 pb-20 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Saved Ad Projects</h2>
          <p className="text-xs text-slate-400">
            {projects.length} saved campaign{projects.length === 1 ? '' : 's'}
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Ad</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3 mb-5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search campaigns, headlines, keywords..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Ads' },
            { id: 'favorites', label: 'Favorites' },
            { id: 'instagram', label: 'Instagram' },
            { id: 'tiktok', label: 'TikTok' },
            { id: 'whatsapp', label: 'WhatsApp' },
            { id: 'google_ads', label: 'Google Ads' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap text-xs font-medium ${
                selectedFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards List */}
      {filteredProjects.length === 0 ? (
        <div className="my-auto py-12 text-center p-6 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800">
          <FolderHeart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-300">No campaigns found</h4>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
            {searchQuery
              ? 'Try modifying your search or filter keywords.'
              : 'Create your first ad with the wizard to save campaigns here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map(proj => (
            <div
              key={proj.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div
                onClick={() => onOpenProject(proj)}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                  <span className="font-bold text-indigo-400 uppercase tracking-wide">
                    {proj.platform}
                  </span>
                  <span>·</span>
                  <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
                  <span>·</span>
                  <span className="text-slate-500 capitalize">{proj.inputs.tone}</span>
                </div>

                <h3 className="text-xs md:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {proj.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                  "{proj.results.headlines[0]}"
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <button
                  onClick={() => onToggleFavorite(proj.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    proj.isFavorite
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                      : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-white'
                  }`}
                  title="Favorite"
                >
                  <Heart className={`w-3.5 h-3.5 ${proj.isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => onCopyText(proj.results.headlines[0], 'Top Headline')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy Headline"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenProject(proj)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                >
                  Open Studio
                </button>

                <button
                  onClick={() => onDeleteProject(proj.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
