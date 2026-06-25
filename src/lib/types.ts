// ─── Core Input Types ──────────────────────────────────────────────────────────
export type InputType = "website" | "brand" | "product" | "niche";

export interface NormalizedInput {
  type: InputType;
  value: string;
  originalValue: string;
}

// ─── Competitor ────────────────────────────────────────────────────────────────
export interface Competitor {
  name: string;
  website: string;
  description: string;
  category: string;
}

// ─── Website Research ─────────────────────────────────────────────────────────
export interface WebsiteResearch {
  competitor: string;
  website: string;
  heroHeading: string;
  heroSubtitle: string;
  cta: string;
  products: string[];
  services: string[];
  pricing: string;
  offers: string[];
  navigation: string[];
  testimonials: string[];
  faq: string[];
  trustSignals: string[];
  brandTone: string;
  targetAudience: string;
  usp: string;
  landingPageStructure: string;
  colors: string[];
  typography: string;
  socialLinks: string[];
  newsletter: boolean;
  sourceUrl: string;
}

// ─── Ad ───────────────────────────────────────────────────────────────────────
export interface Ad {
  competitor: string;
  platform: "meta" | "google" | "tiktok" | "instagram" | "youtube";
  headline: string;
  primaryText: string;
  cta: string;
  offer: string;
  creativeType: "image" | "video" | "carousel" | "text";
  landingPage: string;
  duration: string;
  messaging: string;
  sourceUrl: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export type HookType =
  | "pain"
  | "curiosity"
  | "authority"
  | "benefit"
  | "urgency"
  | "question"
  | "emotional";

export interface Hook {
  type: HookType;
  text: string;
  competitor: string;
  platform: string;
  strength: number; // 1-10
}

// ─── Offer ────────────────────────────────────────────────────────────────────
export interface Offer {
  type:
    | "discount"
    | "bundle"
    | "coupon"
    | "free_shipping"
    | "guarantee"
    | "trial"
    | "refund"
    | "upsell"
    | "crosssell";
  description: string;
  competitor: string;
  value: string;
  sourceUrl: string;
}

// ─── Creative Intelligence ────────────────────────────────────────────────────
export interface CreativeInsight {
  competitor: string;
  imageStyle: string;
  videoStyle: string;
  layout: string;
  colors: string[];
  typography: string;
  ctaPlacement: string;
  designStyle: string;
  usesTestimonials: boolean;
  usesSocialProof: boolean;
  usesAnimations: boolean;
  creativeDirection: string;
  keyAngles: string[];
}

// ─── Winning Patterns ─────────────────────────────────────────────────────────
export interface WinningPattern {
  category: string;
  pattern: string;
  frequency: number;
  confidenceScore: number; // 0-100
  examples: string[];
}

export interface WinningPatterns {
  mostCommonOffer: WinningPattern;
  mostCommonCTA: WinningPattern;
  mostCommonColors: WinningPattern;
  mostCommonMessaging: WinningPattern;
  mostCommonAudience: WinningPattern;
  mostCommonLandingPage: WinningPattern;
  mostCommonHook: WinningPattern;
  mostCommonCreative: WinningPattern;
  overallConfidence: number;
}

// ─── SWOT ─────────────────────────────────────────────────────────────────────
export interface SWOT {
  competitor: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

// ─── Recommendations ──────────────────────────────────────────────────────────
export interface Recommendations {
  howToBeatCompetitors: string[];
  landingPageIdeas: string[];
  offerIdeas: string[];
  adIdeas: string[];
  contentIdeas: string[];
  emailIdeas: string[];
  creativeIdeas: string[];
  growthOpportunities: string[];
  quickWins: string[];
}

// ─── Full Report ──────────────────────────────────────────────────────────────
export interface CompetitorReport {
  input: NormalizedInput;
  generatedAt: string;
  executiveSummary: string;
  competitors: Competitor[];
  websiteResearch: WebsiteResearch[];
  ads: Ad[];
  hooks: Hook[];
  offers: Offer[];
  creativeInsights: CreativeInsight[];
  winningPatterns: WinningPatterns;
  swot: SWOT[];
  recommendations: Recommendations;
  conclusion: string;
}

// ─── Streaming Event ──────────────────────────────────────────────────────────
export type LogLevel = "info" | "success" | "warning" | "error";

export interface StreamEvent {
  type: "log" | "progress" | "result" | "error" | "done";
  message?: string;
  level?: LogLevel;
  step?: string;
  stepNumber?: number;
  totalSteps?: number;
  data?: unknown;
}
