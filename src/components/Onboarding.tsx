import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Globe2, Layers, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onStartGuest: () => void;
}

const SLIDES = [
  {
    icon: Sparkles,
    badge: 'AI Marketing Powerhouse',
    title: 'Turn Ideas Into Ads That Sell.',
    subtitle: 'Generate high-converting headlines, captions, and complete campaign angles for your business in seconds.',
    points: ['5 Click-Driven Headlines', 'Full Ad Copy Variations', 'Platform-Optimized Hashtags'],
    accent: 'from-indigo-500 to-cyan-400',
  },
  {
    icon: Layers,
    badge: 'All Major Platforms',
    title: 'Ready for Instagram, TikTok & WhatsApp.',
    subtitle: 'Tailor every message to the platform where your customers buy. From fast TikTok hooks to professional Google Ads.',
    points: ['Instagram Feed & Stories', 'WhatsApp Direct Sales', 'TikTok High-Engagement Hooks'],
    accent: 'from-violet-500 to-indigo-500',
  },
  {
    icon: Globe2,
    badge: 'Bilingual Marketing',
    title: 'English & Urdu Marketing Copy.',
    subtitle: 'Break language barriers. Create culturally fluent advertisements with authentic Urdu typography and phrasing.',
    points: ['اردو اشتہاری مواد', 'Instant Tone Switching', '1-Click Direct Copy & Export'],
    accent: 'from-cyan-400 to-emerald-400',
  },
];

export const Onboarding: React.FC<OnboardingProps> = ({
  onComplete,
  onOpenAuth,
  onStartGuest,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 select-none">
      {/* Top bar with Brand and Skip */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <span className="font-extrabold text-white text-sm">AG</span>
          </div>
          <span className="font-bold text-base tracking-tight text-white">AdGenius AI</span>
        </div>
        <button
          onClick={onComplete}
          className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide Visual and Content */}
      <div className="my-auto py-6 flex flex-col items-center text-center">
        {/* Animated Glow Circle with Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shadow-2xl relative z-10">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${slide.accent} flex items-center justify-center shadow-lg text-white`}>
              <Icon className="w-7 h-7" />
            </div>
          </div>
          <div className={`absolute -inset-2 rounded-3xl bg-gradient-to-tr ${slide.accent} opacity-20 blur-xl animate-pulse`} />
        </div>

        {/* Unboxed Metadata Badge */}
        <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-2">
          {slide.badge}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-white tracking-tight mb-3 px-2 text-balance leading-snug">
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
          {slide.subtitle}
        </p>

        {/* Bullet checklist */}
        <div className="w-full max-w-xs space-y-2 text-left bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
          {slide.points.map((pt, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="font-medium">{pt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="space-y-4 pt-4">
        {/* Carousel indicators */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-700'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Primary CTA */}
        {currentSlide < SLIDES.length - 1 ? (
          <button
            onClick={handleNext}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="space-y-2.5">
            <button
              onClick={onStartGuest}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all"
            >
              <span>Explore as Guest (Free Demo)</span>
              <Sparkles className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenAuth('register')}
                className="h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center border border-slate-700/80 transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center border border-slate-800 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
