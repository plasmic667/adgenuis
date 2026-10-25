import { GoogleGenAI, Type } from '@google/genai';

export interface AdGenerationRequest {
  productName: string;
  productDescription: string;
  category: string;
  targetAudience: string;
  platform: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp' | 'youtube' | 'google_ads' | 'general';
  language: 'en' | 'ur' | 'es' | 'ar' | 'fr';
  tone: 'persuasive' | 'luxury' | 'friendly' | 'urgency' | 'professional' | 'playful';
  objective: 'sales' | 'awareness' | 'leads' | 'engagement' | 'traffic';
  price?: string;
  discount?: string;
  brandName?: string;
  brandSlogan?: string;
}

export interface AdGenerationResponse {
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

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function generateAdContent(request: AdGenerationRequest): Promise<AdGenerationResponse> {
  const ai = getAiClient();

  if (!ai) {
    // High-quality deterministic marketing fallback when API key is not configured or in local demo mode
    return generateFallbackAd(request);
  }

  const prompt = `You are AdGenius AI, a world-class advertising copywriter and marketing strategist.
Create high-converting, professional advertising materials for the following product:

Product Name: ${request.productName}
Description: ${request.productDescription}
Category: ${request.category}
Target Audience: ${request.targetAudience}
Advertising Platform: ${request.platform}
Preferred Language: ${request.language}
Tone of Voice: ${request.tone}
Campaign Objective: ${request.objective}
${request.price ? `Price: ${request.price}` : ''}
${request.discount ? `Discount/Promotion: ${request.discount}` : ''}
${request.brandName ? `Brand Name: ${request.brandName}` : ''}
${request.brandSlogan ? `Existing Slogan: ${request.brandSlogan}` : ''}

Strict Requirements:
1. Provide exactly 5 headline alternatives (high CTR, under 60 characters each).
2. Provide 3 distinct caption variations (Hook-Story-Offer formula, Short punchy 2-liner, Curiosity/Question hook).
3. Provide one Short Ad Copy (50-80 words) and one Long Ad Copy (120-200 words) tailored to ${request.platform}.
4. Provide 4 actionable, persuasive Call-to-Actions (CTAs).
5. Provide 15 relevant strategic hashtags categorized into 5 trending, 5 niche, and 5 brand/product tags.
6. Provide an overarching Campaign Concept and catchy Slogan.
7. Provide 3 platform-specific marketing tips for ${request.platform}.
8. Provide an Urdu translation of the slogan, top headline, caption, and call to action (in proper Urdu script) to support bilingual marketing.

Generate only strictly valid JSON matching the schema.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            campaignConcept: { type: Type.STRING },
            slogan: { type: Type.STRING },
            headlines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            captions: {
              type: Type.OBJECT,
              properties: {
                hookStoryOffer: { type: Type.STRING },
                punchyShort: { type: Type.STRING },
                curiosityQuestion: { type: Type.STRING },
              },
              required: ['hookStoryOffer', 'punchyShort', 'curiosityQuestion'],
            },
            shortAdCopy: { type: Type.STRING },
            longAdCopy: { type: Type.STRING },
            callsToAction: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            hashtags: {
              type: Type.OBJECT,
              properties: {
                trending: { type: Type.ARRAY, items: { type: Type.STRING } },
                niche: { type: Type.ARRAY, items: { type: Type.STRING } },
                brand: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['trending', 'niche', 'brand'],
            },
            platformSpecificTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            urduTranslation: {
              type: Type.OBJECT,
              properties: {
                slogan: { type: Type.STRING },
                headline: { type: Type.STRING },
                caption: { type: Type.STRING },
                callToAction: { type: Type.STRING },
              },
              required: ['slogan', 'headline', 'caption', 'callToAction'],
            },
          },
          required: [
            'campaignConcept',
            'slogan',
            'headlines',
            'captions',
            'shortAdCopy',
            'longAdCopy',
            'callsToAction',
            'hashtags',
            'platformSpecificTips',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return generateFallbackAd(request);
    }
    const parsed = JSON.parse(text) as AdGenerationResponse;
    return parsed;
  } catch (err) {
    console.error('Gemini generation error, falling back:', err);
    return generateFallbackAd(request);
  }
}

export async function refineAdCopy(
  originalText: string,
  instruction: 'shorter' | 'longer' | 'more_persuasive' | 'more_professional' | 'more_urgent' | 'translate_urdu'
): Promise<string> {
  const ai = getAiClient();
  if (!ai) {
    if (instruction === 'shorter') return originalText.split('.').slice(0, 2).join('.') + '.';
    if (instruction === 'more_urgent') return `🔥 Limited Time Offer! ${originalText} Act fast before stock runs out!`;
    if (instruction === 'more_professional') return `Discover enhanced performance and reliability: ${originalText}`;
    if (instruction === 'translate_urdu') return `ابھی حاصل کریں بہترین معیار اور قیمت کے ساتھ۔ محدود وقت کی خصوصی رعایت!`;
    return originalText;
  }

  const promptMap = {
    shorter: `Rewrite this ad copy to be ultra-punchy, concise, and under 25 words: "${originalText}"`,
    longer: `Expand this ad copy with vivid sensory storytelling and benefits: "${originalText}"`,
    more_persuasive: `Rewrite this ad copy using psychological influence and objection handling: "${originalText}"`,
    more_professional: `Rewrite this ad copy for an executive, premium B2B or upscale audience: "${originalText}"`,
    more_urgent: `Rewrite this ad copy with intense FOMO, limited quantity, and immediate deadline urgency: "${originalText}"`,
    translate_urdu: `Translate and localize this advertising copy into natural, persuasive Urdu marketing language (in Urdu script): "${originalText}"`,
  };

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptMap[instruction],
    });
    return res.text?.trim() || originalText;
  } catch (err) {
    console.error('Refine error:', err);
    return originalText;
  }
}

function generateFallbackAd(req: AdGenerationRequest): AdGenerationResponse {
  const brand = req.brandName || req.productName;
  const discountStr = req.discount ? ` - Save ${req.discount}` : '';
  const priceStr = req.price ? ` starting at ${req.price}` : '';

  return {
    campaignConcept: `Elevate Your Everyday with ${req.productName} — Engineered for ${req.targetAudience}`,
    slogan: req.brandSlogan || `Experience Perfection. Choose ${brand}.`,
    headlines: [
      `Upgrade Your Life With ${req.productName}${discountStr}`,
      `Why ${req.targetAudience} Are Obsessed With ${brand}`,
      `Say Goodbye to Compromise. Meet ${req.productName}`,
      `The Smartest Choice for ${req.targetAudience}${priceStr}`,
      `Limited Stock: Claim Your ${req.productName} Today`,
    ],
    captions: {
      hookStoryOffer: `Tired of settling for average? 🛑 We built ${req.productName} specifically for ${req.targetAudience} who demand quality without the outrageous markup. Experience unmatched durability, sleek aesthetics, and effortless performance.${discountStr ? `\n\n🎉 Special Launch Offer: Get ${req.discount} off your first order today!` : ''}\n\n👇 Tap below to order before stock runs out!`,
      punchyShort: `Designed for ${req.targetAudience}. Proven by thousands. Experience the difference with ${req.productName} today. ⚡`,
      curiosityQuestion: `What if your daily routine was 10x easier? Discover why everyone is making the switch to ${req.productName}. Tap to learn more! ✨`,
    },
    shortAdCopy: `Meet ${req.productName}: the ultimate solution for ${req.targetAudience}. Crafted with premium attention to detail to deliver exceptional value. ${discountStr ? `Order today to claim ${req.discount} off!` : 'Get yours today!'}`,
    longAdCopy: `Finding the right balance of quality, dependability, and price shouldn't feel impossible. That's why ${brand} created ${req.productName}.\n\nWhether you're busy at work, on the go, or relaxing at home, ${req.productName} is engineered to meet your highest standards. Loved by ${req.targetAudience} worldwide, each unit comes with our satisfaction commitment and dedicated support.\n\nDon't wait until it's sold out.${priceStr ? ` Available now${priceStr}.` : ''} Click below to secure yours today!`,
    callsToAction: [
      `Shop Now & Save${req.discount ? ` ${req.discount}` : ''}`,
      `Claim Your ${req.productName}`,
      `Order on WhatsApp Now`,
      `Get Instant Access`,
    ],
    hashtags: {
      trending: [`#${req.category.replace(/\s+/g, '')}Deals`, `#SmartShopping2026`, `#TrendAlert`, `#ViralProduct`, `#MustHaveNow`],
      niche: [`#${req.productName.replace(/[^a-zA-Z0-9]/g, '')}`, `#Best${req.category.replace(/\s+/g, '')}`, `#For${req.targetAudience.replace(/[^a-zA-Z0-9]/g, '')}`, `#QualityFirst`, `#DailyEssentials`],
      brand: [`#${brand.replace(/[^a-zA-Z0-9]/g, '')}`, `#AdGeniusSpecial`, `#DirectToConsumer`, `#VerifiedQuality`, `#ShopLocal`],
    },
    platformSpecificTips: [
      `For ${req.platform.toUpperCase()}: Feature clear pricing and bold contrast in the first 3 seconds of creative view.`,
      `Pair headline #1 with an active product demonstration for maximum conversion.`,
      `Add the WhatsApp CTA for customers who prefer direct messaging and personal consultation.`,
    ],
    urduTranslation: {
      slogan: `بہترین معیار، ناقابل فراموش تجربہ — صرف ${brand} کے ساتھ۔`,
      headline: `${req.productName} کے ساتھ اپنی زندگی آسان اور خوبصورت بنائیں۔`,
      caption: `کیا آپ بہترین معیار کی تلاش میں ہیں؟ ${req.productName} اب دستیاب ہے خصوصی رعایت کے ساتھ۔ طلبہ اور پروفیشنلز کی پہلی پسند! ابھی آرڈر کریں اور فائدہ اٹھائیں۔`,
      callToAction: `ابھی آرڈر کریں — محدود اسٹاک!`,
    },
  };
}
