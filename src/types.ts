export type AdPlatform =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'whatsapp'
  | 'youtube'
  | 'google_ads'
  | 'general';

export type AdLanguage = 'en' | 'ur' | 'es' | 'ar' | 'fr';

export type AdTone =
  | 'persuasive'
  | 'luxury'
  | 'friendly'
  | 'urgency'
  | 'professional'
  | 'playful';

export type AdObjective =
  | 'sales'
  | 'awareness'
  | 'leads'
  | 'engagement'
  | 'traffic';

export interface AdInputs {
  productName: string;
  productDescription: string;
  category: string;
  targetAudience: string;
  platform: AdPlatform;
  language: AdLanguage;
  tone: AdTone;
  objective: AdObjective;
  price?: string;
  discount?: string;
  brandName?: string;
  brandSlogan?: string;
  productImageUrl?: string;
}

export interface AdResultData {
  campaignConcept: string;
  slogan: string;
  headlines: string[];
  captions: {
    hookStoryOffer: string;
    punchyShort: string;
    curiosityQuestion: string;
  };
  shortAdCopy: string;
  longAdCopy: string;
  callsToAction: string[];
  hashtags: {
    trending: string[];
    niche: string[];
    brand: string[];
  };
  platformSpecificTips: string[];
  urduTranslation?: {
    slogan: string;
    headline: string;
    caption: string;
    callToAction: string;
  };
}

export interface AdProject {
  id: string;
  title: string;
  createdAt: string;
  platform: AdPlatform;
  inputs: AdInputs;
  results: AdResultData;
  isFavorite: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  isGuest: boolean;
  plan: 'free' | 'pro' | 'agency';
  creditsRemaining: number;
  totalGenerated: number;
}
