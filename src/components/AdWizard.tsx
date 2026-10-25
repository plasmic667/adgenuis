import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  Check,
  AlertCircle,
  HelpCircle,
  Camera,
  UploadCloud,
  Layers,
  Globe2,
  DollarSign,
  Tag,
  Target,
  FileText,
} from 'lucide-react';
import { AdInputs, AdPlatform, AdLanguage, AdTone, AdObjective } from '../types';

interface AdWizardProps {
  initialValues?: Partial<AdInputs>;
  onGenerate: (inputs: AdInputs) => Promise<void>;
  onCancel: () => void;
  isGenerating: boolean;
}

const PLATFORMS: Array<{ id: AdPlatform; label: string; icon: string; desc: string }> = [
  { id: 'instagram', label: 'Instagram', icon: '📸', desc: 'Feed & Stories high-visual aesthetic' },
  { id: 'facebook', label: 'Facebook', icon: '👥', desc: 'Storytelling & community engagement' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', desc: 'Fast hook & viral sound style' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬', desc: 'Direct message broadcast & conversational' },
  { id: 'youtube', label: 'YouTube', icon: '▶️', desc: 'Video descriptions & bumper scripts' },
  { id: 'google_ads', label: 'Google Ads', icon: '🔍', desc: 'Search headlines & high-intent keywords' },
  { id: 'general', label: 'Omnichannel', icon: '🌐', desc: 'Universal multi-purpose marketing kit' },
];

const TONES: Array<{ id: AdTone; label: string; desc: string }> = [
  { id: 'persuasive', label: 'Persuasive', desc: 'Psychological benefits & urgency' },
  { id: 'luxury', label: 'Luxury & Sleek', desc: 'Refined, premium, exclusive' },
  { id: 'friendly', label: 'Warm & Friendly', desc: 'Approachable and conversational' },
  { id: 'urgency', label: 'High Urgency / FOMO', desc: 'Limited quantities, countdowns' },
  { id: 'professional', label: 'Professional B2B', desc: 'Data-driven, trusted, executive' },
  { id: 'playful', label: 'Playful & Witty', desc: 'Humor, modern slang & energy' },
];

const OBJECTIVES: Array<{ id: AdObjective; label: string }> = [
  { id: 'sales', label: 'E-commerce Sales & Orders' },
  { id: 'leads', label: 'Customer Inquiries & Leads' },
  { id: 'awareness', label: 'Brand Discovery & Reach' },
  { id: 'traffic', label: 'Website / Store Clicks' },
  { id: 'engagement', label: 'Likes, Comments & Shares' },
];

const LANGUAGES: Array<{ id: AdLanguage; label: string; native: string }> = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'ur', label: 'Urdu', native: 'اردو' },
  { id: 'es', label: 'Spanish', native: 'Español' },
  { id: 'ar', label: 'Arabic', native: 'العربية' },
  { id: 'fr', label: 'French', native: 'Français' },
];

const PRESET_IMAGES = [
  { name: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tea & Spice', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
  { name: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  { name: 'Serum/Cosmetic', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80' },
];

export const AdWizard: React.FC<AdWizardProps> = ({
  initialValues,
  onGenerate,
  onCancel,
  isGenerating,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<AdInputs>({
    productName: initialValues?.productName || '',
    productDescription: initialValues?.productDescription || '',
    category: initialValues?.category || 'Consumer Goods',
    targetAudience: initialValues?.targetAudience || '',
    platform: initialValues?.platform || 'instagram',
    language: initialValues?.language || 'en',
    tone: initialValues?.tone || 'persuasive',
    objective: initialValues?.objective || 'sales',
    price: initialValues?.price || '',
    discount: initialValues?.discount || '',
    brandName: initialValues?.brandName || '',
    brandSlogan: initialValues?.brandSlogan || '',
    productImageUrl: initialValues?.productImageUrl || PRESET_IMAGES[0].url,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.productName.trim()) {
        errs.productName = 'Product name is required';
      }
      if (!formData.productDescription.trim()) {
        errs.productDescription = 'Please enter a short product description (at least 15 chars)';
      } else if (formData.productDescription.trim().length < 15) {
        errs.productDescription = 'Give more context so AI can write better ads (minimum 15 characters)';
      }
    }
    if (currentStep === 2) {
      if (!formData.targetAudience.trim()) {
        errs.targetAudience = 'Specify who will buy this product (e.g. college students, busy moms)';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (validateStep(1) && validateStep(2)) {
      await onGenerate(formData);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, productImageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-slate-950 text-slate-100 pb-20 overflow-y-auto">
      {/* Top Breadcrumb & Step Indicators */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : onCancel())}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">AI Ad Creation Wizard</h2>
            <p className="text-[11px] text-slate-400">Step {step} of 4</p>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s ? 'w-6 bg-indigo-500' : step > s ? 'w-3 bg-indigo-700' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: Product Information */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Step 1 · Core Offer
            </span>
            <h3 className="text-lg font-bold text-white">Tell us about your product or service</h3>
            <p className="text-xs text-slate-400">
              The more details you provide, the sharper and more persuasive your ad copy will be.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Product or Service Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={e => setFormData({ ...formData, productName: e.target.value })}
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                className={`w-full h-11 px-3.5 rounded-xl bg-slate-900 border text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.productName ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.productName && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.productName}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Product Description & Key Features <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.productDescription}
                onChange={e => setFormData({ ...formData, productDescription: e.target.value })}
                placeholder="e.g. 45-hour battery life, ergonomic memory foam cushions, active noise cancellation, waterproof, sleek black finish."
                className={`w-full p-3.5 rounded-xl bg-slate-900 border text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.productDescription ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.productDescription && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.productDescription}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Electronics, Fashion, Health, Food"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Name (Optional)</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                  placeholder="e.g. AuraSound"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Price (Optional)</label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. $149 or Rs. 4,500"
                    className="w-full h-10 pl-8 pr-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Discount or Offer (Optional)</label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={e => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="e.g. 20% Off Launch Special, Free Shipping"
                    className="w-full h-10 pl-8 pr-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Audience & Tone */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Step 2 · Targeting & Voice
            </span>
            <h3 className="text-lg font-bold text-white">Who are you selling to?</h3>
            <p className="text-xs text-slate-400">
              Defining the right audience and emotional tone ensures high engagement and conversion.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Target Audience <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g. University students, gym enthusiasts, busy remote workers, freelancers"
                className={`w-full h-11 px-3.5 rounded-xl bg-slate-900 border text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.targetAudience ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.targetAudience && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.targetAudience}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Brand Tone of Voice
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, tone: t.id })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      formData.tone === t.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{t.label}</span>
                      {formData.tone === t.id && (
                        <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Primary Campaign Objective
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OBJECTIVES.map(obj => (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, objective: obj.id })}
                    className={`px-3 py-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      formData.objective === obj.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{obj.label}</span>
                    {formData.objective === obj.id && (
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Platform & Language */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Step 3 · Distribution & Language
            </span>
            <h3 className="text-lg font-bold text-white">Where will you run this ad?</h3>
            <p className="text-xs text-slate-400">
              Each platform requires distinct character limits, hooks, and formatting strategies.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Advertising Platform
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, platform: p.id })}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      formData.platform === p.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xl shrink-0">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{p.label}</span>
                        {formData.platform === p.id && (
                          <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{p.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Primary Language (Urdu & Bilingual Supported)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, language: lang.id })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      formData.language === lang.id
                        ? 'bg-indigo-600 text-white font-bold border-indigo-500 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs block font-semibold">{lang.label}</span>
                    <span className="text-[10px] opacity-75 block">{lang.native}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Visuals & Confirmation */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Step 4 · Visual Creative Asset
            </span>
            <h3 className="text-lg font-bold text-white">Product Photo & Ad Artwork</h3>
            <p className="text-xs text-slate-400">
              Upload your own photo or pick a high-res sample to preview on the live platform mockup.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Visual Preview Box */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center group">
              {formData.productImageUrl ? (
                <>
                  <img
                    src={formData.productImageUrl}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                      {formData.platform.toUpperCase()} CREATIVE
                    </span>
                    <h4 className="text-sm font-extrabold text-white truncate">{formData.productName}</h4>
                    {formData.discount && (
                      <span className="text-xs font-semibold text-emerald-400">{formData.discount}</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No image selected</p>
                </div>
              )}
            </div>

            {/* Upload or Preset Options */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Choose Sample Photography or Upload
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, productImageUrl: preset.url })}
                    className={`relative rounded-xl overflow-hidden border aspect-square group transition-all ${
                      formData.productImageUrl === preset.url
                        ? 'ring-2 ring-indigo-500 border-indigo-500'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] text-white py-0.5 text-center truncate">
                      {preset.name}
                    </div>
                  </button>
                ))}
              </div>

              {/* Upload Input */}
              <label className="w-full h-11 rounded-xl bg-slate-900 border border-dashed border-slate-700 hover:border-indigo-500 flex items-center justify-center gap-2 text-xs text-slate-300 cursor-pointer hover:bg-slate-850 transition-colors">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                <span>Upload Custom Product Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Review Summary */}
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Product:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{formData.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Audience:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{formData.targetAudience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Platform:</span>
                <span className="font-semibold text-indigo-400 uppercase">{formData.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Language:</span>
                <span className="font-semibold text-white uppercase">{formData.language}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-6 mt-auto">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="h-12 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-colors"
            >
              Back
            </button>
          )}

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleNext}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating AdGenius AI Copy...</span>
              </>
            ) : step < 4 ? (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Ad Campaign</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
