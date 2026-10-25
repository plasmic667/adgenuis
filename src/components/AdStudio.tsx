import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  FolderHeart,
  Download,
  Share2,
  RefreshCw,
  Edit3,
  Heart,
  Globe2,
  Sliders,
  Send,
  MessageCircle,
  ExternalLink,
  Smartphone,
  Flame,
  Zap,
  Tag,
  CheckCircle2,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { AdInputs, AdResultData, AdProject } from '../types';

interface AdStudioProps {
  project: AdProject;
  onUpdateResults: (newResults: AdResultData) => void;
  onToggleFavorite: (id: string) => void;
  onCopyText: (text: string, label: string) => void;
  onRefineCopy: (originalText: string, instruction: any) => Promise<string>;
  onBackToDashboard: () => void;
}

export const AdStudio: React.FC<AdStudioProps> = ({
  project,
  onUpdateResults,
  onToggleFavorite,
  onCopyText,
  onRefineCopy,
  onBackToDashboard,
}) => {
  const { inputs, results } = project;
  const [activeTab, setActiveTab] = useState<'copy' | 'preview' | 'urdu' | 'tips'>('copy');
  const [previewPlatform, setPreviewPlatform] = useState<string>(inputs.platform || 'instagram');
  const [selectedCaptionType, setSelectedCaptionType] = useState<'hookStoryOffer' | 'punchyShort' | 'curiosityQuestion'>('hookStoryOffer');
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editableValues, setEditableValues] = useState<Record<string, string>>({
    slogan: results.slogan,
    concept: results.campaignConcept,
    caption: results.captions[selectedCaptionType],
    shortCopy: results.shortAdCopy,
    longCopy: results.longAdCopy,
  });

  const handleFieldChange = (key: string, val: string) => {
    setEditableValues(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveEdit = (key: string) => {
    setEditingField(null);
    const updated = { ...results };
    if (key === 'slogan') updated.slogan = editableValues.slogan;
    if (key === 'concept') updated.campaignConcept = editableValues.concept;
    if (key === 'caption') {
      updated.captions = {
        ...updated.captions,
        [selectedCaptionType]: editableValues.caption,
      };
    }
    if (key === 'shortCopy') updated.shortAdCopy = editableValues.shortCopy;
    if (key === 'longCopy') updated.longAdCopy = editableValues.longCopy;
    onUpdateResults(updated);
  };

  const handleRefine = async (field: 'caption' | 'shortCopy' | 'longCopy', instruction: string) => {
    setIsRefining(true);
    const currentText = editableValues[field];
    try {
      const refined = await onRefineCopy(currentText, instruction as any);
      setEditableValues(prev => ({ ...prev, [field]: refined }));
      const updated = { ...results };
      if (field === 'caption') {
        updated.captions = { ...updated.captions, [selectedCaptionType]: refined };
      } else if (field === 'shortCopy') {
        updated.shortAdCopy = refined;
      } else if (field === 'longCopy') {
        updated.longAdCopy = refined;
      }
      onUpdateResults(updated);
      onCopyText(refined, 'Refined Copy');
    } finally {
      setIsRefining(false);
    }
  };

  const handleExportText = () => {
    const textContent = `================================================
ADGENIUS AI - ADVERTISING CAMPAIGN KIT
Brand / Product: ${inputs.productName}
Platform: ${inputs.platform.toUpperCase()}
Tone: ${inputs.tone} | Objective: ${inputs.objective}
Date: ${new Date(project.createdAt).toLocaleDateString()}
================================================

CAMPAIGN CONCEPT:
${results.campaignConcept}

SLOGAN:
${results.slogan}

5 HEADLINES:
${results.headlines.map((h, i) => `${i + 1}. ${h} (${h.length} chars)`).join('\n')}

SELECTED CAPTION (${selectedCaptionType}):
${editableValues.caption}

SHORT AD COPY:
${editableValues.shortCopy}

LONG AD COPY:
${editableValues.longCopy}

CALLS TO ACTION:
${results.callsToAction.map((cta, i) => `• ${cta}`).join('\n')}

STRATEGIC HASHTAGS:
${[...results.hashtags.trending, ...results.hashtags.niche, ...results.hashtags.brand].join(' ')}

URDU TRANSLATION:
Slogan: ${results.urduTranslation?.slogan || ''}
Headline: ${results.urduTranslation?.headline || ''}
Caption: ${results.urduTranslation?.caption || ''}
CTA: ${results.urduTranslation?.callToAction || ''}
================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inputs.productName.toLowerCase().replace(/\s+/g, '_')}_ad_kit.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onCopyText('Exported ad kit file!', 'Export File');
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-slate-950 text-slate-100 pb-20 overflow-y-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
              {inputs.platform} · {inputs.tone}
            </span>
            <span className="text-[10px] text-slate-500">·</span>
            <span className="text-[10px] text-emerald-400 font-medium">AI Generated</span>
          </div>
          <h2 className="text-base md:text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
            {inputs.productName}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleFavorite(project.id)}
            className={`p-2 rounded-xl border transition-colors ${
              project.isFavorite
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Save to Favorites"
          >
            <Heart className={`w-4 h-4 ${project.isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleExportText}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Download Ad Campaign Kit (.txt)"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800 mb-5 select-none">
        <button
          onClick={() => setActiveTab('copy')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'copy'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Copy & Headlines
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'preview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Live Platform Mockup
        </button>
        <button
          onClick={() => setActiveTab('urdu')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'urdu'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          اردو اشتہار (Urdu)
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'tips'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Tips
        </button>
      </div>

      {/* TAB 1: COPY & HEADLINES */}
      {activeTab === 'copy' && (
        <div className="space-y-6">
          {/* Slogan & Concept Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 relative group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                Campaign Angle & Slogan
              </span>
              <button
                onClick={() => onCopyText(`${results.slogan} — ${results.campaignConcept}`, 'Slogan & Concept')}
                className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
            <h3 className="text-base font-extrabold text-white tracking-tight">"{results.slogan}"</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{results.campaignConcept}</p>
          </div>

          {/* 5 Headline Alternatives */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">5 High-CTR Headlines</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  Ranked
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Click to copy</span>
            </div>

            <div className="space-y-2">
              {results.headlines.map((headline, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-indigo-400 mt-0.5">
                      0{idx + 1}
                    </span>
                    <p className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
                      {headline}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                      {headline.length} chars
                    </span>
                    <button
                      onClick={() => onCopyText(headline, `Headline #${idx + 1}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-colors"
                      title="Copy headline"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Variation Captions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">Ad Caption Variations</h3>
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                <button
                  onClick={() => {
                    setSelectedCaptionType('hookStoryOffer');
                    setEditableValues(prev => ({ ...prev, caption: results.captions.hookStoryOffer }));
                  }}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    selectedCaptionType === 'hookStoryOffer' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Hook-Story-Offer
                </button>
                <button
                  onClick={() => {
                    setSelectedCaptionType('punchyShort');
                    setEditableValues(prev => ({ ...prev, caption: results.captions.punchyShort }));
                  }}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    selectedCaptionType === 'punchyShort' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Punchy 2-Liner
                </button>
                <button
                  onClick={() => {
                    setSelectedCaptionType('curiosityQuestion');
                    setEditableValues(prev => ({ ...prev, caption: results.captions.curiosityQuestion }));
                  }}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    selectedCaptionType === 'curiosityQuestion' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Curiosity Hook
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <textarea
                rows={5}
                value={editableValues.caption}
                onChange={e => handleFieldChange('caption', e.target.value)}
                className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />

              {/* AI Quick Refinement Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase mr-1">AI Polish:</span>
                  <button
                    disabled={isRefining}
                    onClick={() => handleRefine('caption', 'more_urgent')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-medium transition-colors"
                  >
                    🔥 Add Urgency
                  </button>
                  <button
                    disabled={isRefining}
                    onClick={() => handleRefine('caption', 'shorter')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-medium transition-colors"
                  >
                    ✂️ Shorten
                  </button>
                  <button
                    disabled={isRefining}
                    onClick={() => handleRefine('caption', 'more_persuasive')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-medium transition-colors"
                  >
                    🎯 More Persuasive
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveEdit('caption')}
                    className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => onCopyText(editableValues.caption, 'Ad Caption')}
                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                    title="Copy Caption"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Short & Long Ad Copy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Short Form Copy */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Short Ad Copy (Quick View)</span>
                <button
                  onClick={() => onCopyText(editableValues.shortCopy, 'Short Ad Copy')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={editableValues.shortCopy}
                onChange={e => handleFieldChange('shortCopy', e.target.value)}
                className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Long Form Copy */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Long Form Storytelling</span>
                <button
                  onClick={() => onCopyText(editableValues.longCopy, 'Long Ad Copy')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={editableValues.longCopy}
                onChange={e => handleFieldChange('longCopy', e.target.value)}
                className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Calls to Action */}
          <div>
            <h3 className="text-sm font-bold text-white mb-2.5">Call to Action (CTA) Buttons</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {results.callsToAction.map((cta, idx) => (
                <button
                  key={idx}
                  onClick={() => onCopyText(cta, `CTA: ${cta}`)}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500 text-left transition-all group"
                >
                  <span className="text-[10px] text-slate-500 uppercase block mb-0.5">CTA 0{idx + 1}</span>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors block truncate">
                    {cta}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Categorized Hashtags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">15 Strategic Hashtags</h3>
              <button
                onClick={() => {
                  const allTags = [
                    ...results.hashtags.trending,
                    ...results.hashtags.niche,
                    ...results.hashtags.brand,
                  ].join(' ');
                  onCopyText(allTags, 'All 15 Hashtags');
                }}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All 15</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block mb-1.5">
                  🔥 Trending & Broad Reach
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {results.hashtags.trending.map((tag, i) => (
                    <span
                      key={i}
                      onClick={() => onCopyText(tag, tag)}
                      className="text-xs text-cyan-300 hover:text-white cursor-pointer hover:underline"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1.5">
                  🎯 Niche & Category High-Intent
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {results.hashtags.niche.map((tag, i) => (
                    <span
                      key={i}
                      onClick={() => onCopyText(tag, tag)}
                      className="text-xs text-indigo-300 hover:text-white cursor-pointer hover:underline"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1.5">
                  🏷️ Brand & Community
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {results.hashtags.brand.map((tag, i) => (
                    <span
                      key={i}
                      onClick={() => onCopyText(tag, tag)}
                      className="text-xs text-emerald-300 hover:text-white cursor-pointer hover:underline"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE PLATFORM MOCKUP PREVIEWS */}
      {activeTab === 'preview' && (
        <div className="space-y-5">
          {/* Platform Switcher Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['instagram', 'tiktok', 'whatsapp', 'facebook', 'google_ads'].map(plat => (
              <button
                key={plat}
                onClick={() => setPreviewPlatform(plat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  previewPlatform === plat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {plat === 'google_ads' ? 'Google Search' : plat}
              </button>
            ))}
          </div>

          {/* MOCKUP: Instagram Post */}
          {previewPlatform === 'instagram' && (
            <div className="max-w-sm mx-auto bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              {/* Instagram Header */}
              <div className="p-3 flex items-center justify-between border-b border-slate-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white">
                      {inputs.brandName?.charAt(0) || 'A'}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {inputs.brandName?.toLowerCase().replace(/\s+/g, '') || 'adgenius.store'}
                    </h4>
                    <span className="text-[10px] text-slate-400 block">Sponsored</span>
                  </div>
                </div>
                <span className="text-slate-400 text-sm">•••</span>
              </div>

              {/* Product Creative Image */}
              <div className="relative aspect-square bg-slate-900">
                {inputs.productImageUrl && (
                  <img
                    src={inputs.productImageUrl}
                    alt={inputs.productName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                {/* Overlay Badge */}
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 max-w-[85%]">
                  <p className="text-xs font-extrabold text-white truncate">{results.headlines[0]}</p>
                  {inputs.discount && (
                    <span className="text-[10px] text-emerald-400 font-semibold">{inputs.discount}</span>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 bg-slate-950">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 text-slate-200">
                    <Heart className="w-5 h-5 hover:text-pink-500 transition-colors" />
                    <MessageCircle className="w-5 h-5" />
                    <Send className="w-5 h-5" />
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg">
                    {results.callsToAction[0] || 'Shop Now'}
                  </button>
                </div>

                <div className="text-xs text-slate-200 leading-snug">
                  <span className="font-bold mr-1.5 text-white">
                    {inputs.brandName?.toLowerCase().replace(/\s+/g, '') || 'adgenius.store'}
                  </span>
                  <span>{editableValues.caption.slice(0, 160)}...</span>
                </div>

                <div className="text-[11px] text-indigo-400 mt-2 truncate">
                  {results.hashtags.trending.slice(0, 4).join(' ')}
                </div>
              </div>
            </div>
          )}

          {/* MOCKUP: TikTok Sponsored Video Ad */}
          {previewPlatform === 'tiktok' && (
            <div className="max-w-sm mx-auto bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl aspect-[9/16] relative flex flex-col justify-between p-4">
              {inputs.productImageUrl && (
                <img
                  src={inputs.productImageUrl}
                  alt={inputs.productName}
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

              {/* TikTok Top bar */}
              <div className="relative z-10 flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-white tracking-widest uppercase">Following | For You</span>
                <span className="text-xs text-slate-300">Live</span>
              </div>

              {/* Right Side Interaction Icons */}
              <div className="relative z-10 ml-auto space-y-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-pink-500">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[10px] text-white font-mono mt-0.5">24.5k</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-white font-mono mt-0.5">1,240</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-white font-mono mt-0.5">Share</span>
                </div>
              </div>

              {/* Bottom Caption & CTA */}
              <div className="relative z-10 space-y-2 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">@{inputs.brandName || 'AdGenius'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-pink-600/80 text-white font-semibold">Sponsored</span>
                </div>
                <p className="text-xs text-slate-100 line-clamp-2">
                  {results.headlines[0]} — {editableValues.caption.slice(0, 90)}...
                </p>
                <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-semibold truncate">
                  {results.hashtags.trending.slice(0, 3).join(' ')}
                </div>
                <button className="w-full h-10 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center shadow-lg">
                  {results.callsToAction[0] || 'Order Now'}
                </button>
              </div>
            </div>
          )}

          {/* MOCKUP: WhatsApp Chat Message Card */}
          {previewPlatform === 'whatsapp' && (
            <div className="max-w-sm mx-auto bg-[#0b141a] border border-[#1f2c34] rounded-3xl overflow-hidden shadow-2xl p-4">
              {/* WhatsApp Chat Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-[#1f2c34] mb-3">
                <div className="w-9 h-9 rounded-full bg-[#00a884] text-white font-bold flex items-center justify-center text-xs">
                  {inputs.brandName?.charAt(0) || 'B'}
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-100">{inputs.brandName || 'AdGenius Official'}</h4>
                  <span className="text-[10px] text-[#00a884]">Official Business Account</span>
                </div>
              </div>

              {/* Message Bubble */}
              <div className="bg-[#1f2c34] rounded-2xl p-3 border border-[#2a3942] space-y-2 text-slate-100">
                {inputs.productImageUrl && (
                  <img
                    src={inputs.productImageUrl}
                    alt={inputs.productName}
                    className="w-full h-36 object-cover rounded-xl mb-2"
                    referrerPolicy="no-referrer"
                  />
                )}
                <h4 className="text-xs font-extrabold text-emerald-400">
                  {results.headlines[0]}
                </h4>
                <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {editableValues.caption}
                </p>
                <div className="pt-2 border-t border-[#2a3942] flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">10:45 AM · Sent</span>
                  <button
                    onClick={() => onCopyText(editableValues.caption, 'WhatsApp Broadcast Message')}
                    className="px-3 py-1 rounded-lg bg-[#00a884] hover:bg-[#029070] text-black font-bold text-xs flex items-center gap-1"
                  >
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MOCKUP: Google Search SERP Result */}
          {(previewPlatform === 'google_ads' || previewPlatform === 'facebook') && (
            <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                  Sponsored
                </span>
                <span className="text-xs text-slate-400 truncate">
                  https://www.{inputs.brandName?.toLowerCase().replace(/\s+/g, '') || 'adgenius'}.com/deal
                </span>
              </div>

              <h4 className="text-base font-semibold text-indigo-400 hover:underline cursor-pointer leading-tight">
                {results.headlines[0]} | {results.slogan}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {editableValues.shortCopy} {inputs.discount ? `Save ${inputs.discount} when you order online today!` : ''}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div className="text-indigo-300 font-semibold cursor-pointer hover:underline">
                  • {results.callsToAction[0] || 'Shop Catalog'}
                </div>
                <div className="text-indigo-300 font-semibold cursor-pointer hover:underline">
                  • 24/7 Support & Warranty
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DEDICATED URDU MARKETING SECTION */}
      {activeTab === 'urdu' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 font-urdu">اردو اشتہاری مواد (Urdu Marketing)</span>
              <button
                onClick={() => {
                  const urduFull = `${results.urduTranslation?.headline}\n\n${results.urduTranslation?.caption}\n\n${results.urduTranslation?.callToAction}`;
                  onCopyText(urduFull, 'مکمل اردو اشتہار');
                }}
                className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 font-semibold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>سب کاپی کریں</span>
              </button>
            </div>
            <p className="text-xs text-slate-300">
              مقامی اور بین الاقوامی مارکیٹ کے لیے پر اثر اور باوقار اردو اشتہارات۔
            </p>
          </div>

          {/* Urdu Headline */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-right space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onCopyText(results.urduTranslation?.headline || '', 'Urdu Headline')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Headline</span>
              </button>
              <span className="text-xs font-bold text-slate-400">مرکزی ہیڈ لائن</span>
            </div>
            <h3 className="text-lg font-bold text-white font-urdu leading-loose">
              {results.urduTranslation?.headline}
            </h3>
          </div>

          {/* Urdu Caption */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-right space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onCopyText(results.urduTranslation?.caption || '', 'Urdu Caption')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Caption</span>
              </button>
              <span className="text-xs font-bold text-slate-400">تفصیلی اشتہاری متن</span>
            </div>
            <p className="text-sm text-slate-200 font-urdu leading-loose whitespace-pre-line">
              {results.urduTranslation?.caption}
            </p>
          </div>

          {/* Urdu CTA & Slogan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 block mb-1">دعوتِ عمل (Call to Action)</span>
              <p className="text-sm font-bold text-emerald-400 font-urdu">
                {results.urduTranslation?.callToAction}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 block mb-1">شعار (Slogan)</span>
              <p className="text-sm font-bold text-indigo-300 font-urdu">
                {results.urduTranslation?.slogan}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PLATFORM TIPS */}
      {activeTab === 'tips' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2">
              Optimization Advice for {inputs.platform.toUpperCase()}
            </h3>
            <div className="space-y-2.5">
              {results.platformSpecificTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {idx + 1}
                  </div>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 space-y-1">
            <h4 className="font-bold text-white">Ad Compliance & Review Notice</h4>
            <p className="text-slate-400 leading-relaxed">
              Always verify price guarantees, medical or technical specifications before running commercial ad spend. AdGenius AI generates high-CTR copy designed to be reviewed and approved by your business team.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
