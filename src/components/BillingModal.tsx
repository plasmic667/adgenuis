import React, { useState } from 'react';
import {
  Check,
  Zap,
  Crown,
  ShieldCheck,
  Sparkles,
  X,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { UserAccount } from '../types';

interface BillingModalProps {
  user: UserAccount;
  onUpgradePlan: (plan: 'pro' | 'agency') => void;
  onClose: () => void;
}

export const BillingModal: React.FC<BillingModalProps> = ({
  user,
  onUpgradePlan,
  onClose,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showPlaySheet, setShowPlaySheet] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<'pro' | 'agency'>('pro');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSelectPlan = (tier: 'pro' | 'agency') => {
    setSelectedTier(tier);
    setShowPlaySheet(true);
  };

  const handleConfirmGooglePlay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPlaySheet(false);
      onUpgradePlan(selectedTier);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-slate-950 text-slate-100 pb-20 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
            Google Play Subscription
          </span>
          <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Upgrade AdGenius AI</h2>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Billing Cycle Switch */}
      <div className="flex items-center justify-center gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800 max-w-xs mx-auto mb-6">
        <button
          onClick={() => setBillingCycle('annual')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            billingCycle === 'annual'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Annual (Save 20%)
        </button>
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            billingCycle === 'monthly'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full mb-6">
        {/* Pro Marketer Plan */}
        <div className="relative rounded-3xl p-5 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border-2 border-indigo-500 shadow-xl flex flex-col justify-between">
          <div className="absolute -top-3 right-5 bg-indigo-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
            Most Popular
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Pro Marketer</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              For online sellers, content creators, and small business owners.
            </p>

            <div className="mb-4">
              <span className="text-2xl font-extrabold text-white">
                {billingCycle === 'annual' ? '$15' : '$19'}
              </span>
              <span className="text-xs text-slate-400 font-medium"> / month</span>
              {billingCycle === 'annual' && (
                <span className="text-[10px] text-emerald-400 block font-semibold">Billed annually ($180/yr)</span>
              )}
            </div>

            <ul className="space-y-2 text-xs text-slate-300 mb-6">
              {[
                'Unlimited AI Ad Generations',
                '5 High-CTR Headlines per run',
                'All 7 Advertising Platforms',
                'English & Full Urdu Translation',
                'AI Copy Refiner (Urgency & Tone)',
                'Export to JSON, TXT & WhatsApp',
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('pro')}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
          >
            <span>Subscribe with Google Play</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Agency Plan */}
        <div className="rounded-3xl p-5 bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Agency Unlimited</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              For marketing agencies, high-volume dropshippers & multi-brand teams.
            </p>

            <div className="mb-4">
              <span className="text-2xl font-extrabold text-white">
                {billingCycle === 'annual' ? '$39' : '$49'}
              </span>
              <span className="text-xs text-slate-400 font-medium"> / month</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 mb-6">
              {[
                'Everything in Pro Marketer',
                'Multi-client brand tone memory',
                'Priority Gemini 3.8 Flash compute',
                'Bulk CSV batch ad generation',
                'Dedicated commercial ad support',
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('agency')}
            className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Subscribe Agency Tier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Google Play Store Bottom Sheet Simulation */}
      {showPlaySheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-5 animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M3.6 1.8l10.9 10.9-3.3 3.3L1.5 5.2C1 4.5 1 3.5 1.5 2.8l2.1-1z" />
                  <path fill="#34A853" d="M17.8 8.6L14.5 12.7 3.6 1.8c.6-.7 1.6-.7 2.3-.3l11.9 7.1z" />
                  <path fill="#FBBC05" d="M17.8 15.4L5.9 22.5c-.7.4-1.7.4-2.3-.3l10.9-10.9 3.3 4.1z" />
                  <path fill="#EA4335" d="M22.5 11.3l-4.7-2.7-3.3 3.4 3.3 3.4 4.7-2.7c.9-.5.9-1.9 0-2.4z" />
                </svg>
                <span className="text-xs font-bold text-white">Google Play Billing</span>
              </div>
              <button
                onClick={() => setShowPlaySheet(false)}
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    AdGenius AI: {selectedTier === 'pro' ? 'Pro Marketer' : 'Agency Unlimited'}
                  </h4>
                  <span className="text-[11px] text-slate-400">AdGenius Technologies Inc.</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400">
                    {selectedTier === 'pro' ? (billingCycle === 'annual' ? '$180/yr' : '$19/mo') : (billingCycle === 'annual' ? '$468/yr' : '$49/mo')}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Auto-renews</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-300">Google Pay · Visa •••• 4242</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Primary</span>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed">
                By tapping Subscribe, you agree to recurring charges. You can cancel anytime in Google Play Subscriptions.
              </p>

              <button
                disabled={isProcessing}
                onClick={handleConfirmGooglePlay}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing with Google Play...</span>
                  </>
                ) : (
                  <>
                    <span>1-Tap Subscribe</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
