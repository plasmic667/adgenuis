import { AdInputs, AdProject } from '../types';

export const SAMPLE_PRODUCTS: Array<{
  id: string;
  badge: string;
  title: string;
  category: string;
  platform: AdInputs['platform'];
  description: string;
  image: string;
  inputs: AdInputs;
}> = [
  {
    id: 'headphones',
    badge: 'Popular',
    title: 'AuraSound Elite ANC Headphones',
    category: 'Consumer Electronics',
    platform: 'instagram',
    description: 'Wireless active noise-canceling headphones with 45-hour battery life, aerospace aluminum earcups, and studio-grade drivers.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    inputs: {
      productName: 'AuraSound Elite Wireless Headphones',
      productDescription: 'Industry-leading 45dB Active Noise Cancellation, ergonomic memory foam cushions, 45-hour quick-charge battery, and lossless spatial audio.',
      category: 'Electronics & Audio',
      targetAudience: 'University students, software engineers, and frequent travelers',
      platform: 'instagram',
      language: 'en',
      tone: 'luxury',
      objective: 'sales',
      price: '$189',
      discount: '25% Off Launch Week',
      brandName: 'AuraSound Acoustics',
      brandSlogan: 'Pure Silence. Pure Sound.',
      productImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    id: 'chai',
    badge: 'Trending',
    title: 'Royal Shahi Karak Tea & Spices',
    category: 'Food & Beverage',
    platform: 'whatsapp',
    description: 'Authentic stone-ground cardamom tea blend crafted with single-origin Assam leaves and organic saffron crystals.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    inputs: {
      productName: 'Royal Shahi Karak Chai Blend',
      productDescription: 'Hand-picked premium leaf tea enriched with organic green cardamom, cloves, and saffron threads. Brews thick, aromatic traditional Karak tea in 5 minutes.',
      category: 'Artisan Food & Gourmet',
      targetAudience: 'Tea lovers, South Asian diaspora, cafe owners, and hospitality lovers',
      platform: 'whatsapp',
      language: 'ur',
      tone: 'friendly',
      objective: 'leads',
      price: 'Rs. 1,450',
      discount: 'Buy 2 Get 1 Free',
      brandName: 'Shahi Khansama',
      brandSlogan: 'ہر گھونٹ میں شاہی ذائقہ',
      productImageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    id: 'smartwatch',
    badge: 'High CTR',
    title: 'Vanguard Pulse 2 Pro Smartwatch',
    category: 'Fitness & Wearables',
    platform: 'tiktok',
    description: 'AMOLED titanium military-grade GPS smartwatch tracking HRV, sleep stages, VO2 max, and water resistance to 100 meters.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    inputs: {
      productName: 'Vanguard Pulse 2 Pro GPS Watch',
      productDescription: 'Military-grade sapphire crystal smartwatch with offline topographic maps, 14-day battery, ECG heart tracking, and 120+ workout modes.',
      category: 'Wearables & Health Tech',
      targetAudience: 'Marathon runners, CrossFit athletes, gym enthusiasts 20-35',
      platform: 'tiktok',
      language: 'en',
      tone: 'urgency',
      objective: 'sales',
      price: '$129',
      discount: 'Free $40 Nylon Sport Band',
      brandName: 'Vanguard Tech',
      brandSlogan: 'Outlast Every Challenge',
      productImageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    id: 'serum',
    badge: 'Eco',
    title: 'Lumière Radiance Vitamin C Serum',
    category: 'Beauty & Skincare',
    platform: 'facebook',
    description: 'Cold-pressed 15% pure L-Ascorbic acid serum with botanical ferulic acid for 72-hour deep skin barrier hydration.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    inputs: {
      productName: 'Lumière Glow Triple C Serum',
      productDescription: 'Clinically proven 15% vitamin C formula that visibly reduces hyperpigmentation, tightens pores, and protects against blue light and pollution.',
      category: 'Dermatological Skincare',
      targetAudience: 'Women and men aged 24-45 seeking glass-skin radiance and dark spot reduction',
      platform: 'facebook',
      language: 'en',
      tone: 'persuasive',
      objective: 'conversions' as any,
      price: '$34',
      discount: '30% Off Starter Bundles',
      brandName: 'Lumière Botanicals',
      brandSlogan: 'Science-Backed Glass Skin',
      productImageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    },
  },
];

export const INITIAL_PROJECTS: AdProject[] = [
  {
    id: 'proj_headphones_demo',
    title: 'AuraSound Elite Launch Campaign',
    createdAt: '2026-10-24T18:30:00Z',
    platform: 'instagram',
    inputs: SAMPLE_PRODUCTS[0].inputs,
    isFavorite: true,
    results: {
      campaignConcept: 'Escape the Chaos: Engineered for Deep Focus & Studio Sound',
      slogan: 'Pure Silence. Pure Sound.',
      headlines: [
        'Silence the World. Amplify Your Focus.',
        'Why Engineers & Creators Are Switching to AuraSound',
        '45 Hours of Studio Silence on a Single Charge',
        'Your Daily Commute Just Became First Class',
        'Launch Special: Get 25% Off AuraSound Elite',
      ],
      captions: {
        hookStoryOffer: 'Open floor offices and noisy commutes were killing our flow. So we spent 18 months engineering headphones that actually block the world without crushing your ears.\n\nAuraSound Elite combines 45dB active noise canceling with memory foam earcups and lossless spatial drivers.\n\n⚡ For launch week only: Get 25% off + free premium hardshell case. Tap Shop Now below!',
        punchyShort: '45 hours battery. 45dB silence. Zero distractions. Meet AuraSound Elite.',
        curiosityQuestion: 'What if you could mute the entire train with one click? Experience the AuraSound difference today.',
      },
      shortAdCopy: 'Block the noise. Boost your focus. AuraSound Elite delivers 45-hour battery life and studio-grade sound in an ultra-lightweight design. Order today for 25% off.',
      longAdCopy: 'Stop letting background chatter and airport noise interrupt your flow. AuraSound Elite is engineered with cutting-edge 4-mic hybrid active noise cancellation and custom 40mm beryllium drivers for unmatched audio clarity.\n\nWhether you are writing code, studying for exams, or relaxing on a long-haul flight, the plush memory foam earcups stay comfortable all day long.\n\nClaim your pair with 25% launch savings before the opening batch is gone.',
      callsToAction: [
        'Shop 25% Off Today',
        'Claim Your AuraSound Elite',
        'Experience Pure Silence',
        'Order Now with Free Shipping',
      ],
      hashtags: {
        trending: ['#NoiseCancelling', '#AudioPhile', '#DeskSetup2026', '#ProductivityHacks', '#TechDeals'],
        niche: ['#AuraSoundElite', '#CodingMusic', '#FocusMode', '#StudioHeadphones', '#EverydayCarry'],
        brand: ['#AuraSound', '#TurnIdeasIntoAds', '#AdGeniusAI', '#SmartAudio', '#AudioGear'],
      },
      platformSpecificTips: [
        'Use carousel format: Slide 1 product beauty shot, Slide 2 noise-cancellation frequency chart, Slide 3 customer review.',
        'Hook in the first 2 seconds of video reel with background coffee shop noise abruptly cutting to dead silence.',
        'Add a clear link sticker directing directly to checkout with auto-applied discount.',
      ],
      urduTranslation: {
        slogan: 'خاموشی کا جادو، آواز کا نیا انداز۔',
        headline: 'دنیا کے شور کو کریں خاموش، اور کام پر کریں مکمل فوکس۔',
        caption: 'شور شرابے سے تنگ آ چکے ہیں؟ اورا ساؤنڈ ایلیٹ کے ساتھ پائیں 45 گھنٹے کی مسلسل بیٹری اور اسٹوڈیو کوالٹی ساؤنڈ۔ اب 25 فیصد کی شاندار بچت کے ساتھ۔',
        callToAction: 'ابھی 25% رعایت کے ساتھ آرڈر کریں',
      },
    },
  },
];
