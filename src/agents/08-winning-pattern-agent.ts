import { callClaude } from "@/lib/anthropic";
import { Ad, Hook, Offer, WebsiteResearch, WinningPatterns } from "@/lib/types";

export async function runWinningPatternAgent(
  websiteData: WebsiteResearch[],
  ads: Ad[],
  hooks: Hook[],
  offers: Offer[]
): Promise<WinningPatterns> {
  const summary = {
    ctas: ads.map((a) => a.cta).filter(Boolean),
    offers: offers.map((o) => o.type),
    hooks: hooks.map((h) => h.type),
    colors: websiteData.flatMap((w) => w.colors),
    messaging: ads.map((a) => a.messaging).filter(Boolean),
    audiences: websiteData.map((w) => w.targetAudience).filter(Boolean),
    landingPages: websiteData.map((w) => w.landingPageStructure).filter(Boolean),
    creativeTypes: ads.map((a) => a.creativeType),
  };

  const result = await callClaude<WinningPatterns>({
    systemPrompt: `You are a winning pattern detection agent. Analyze competitor data and identify the most common patterns.

Return ONLY valid JSON matching this exact structure:
{
  "mostCommonOffer": {
    "category": "Offers",
    "pattern": "most common offer type/description",
    "frequency": 5,
    "confidenceScore": 85,
    "examples": ["example1", "example2"]
  },
  "mostCommonCTA": {...same structure...},
  "mostCommonColors": {...},
  "mostCommonMessaging": {...},
  "mostCommonAudience": {...},
  "mostCommonLandingPage": {...},
  "mostCommonHook": {...},
  "mostCommonCreative": {...},
  "overallConfidence": 80
}

frequency = number of competitors using this pattern
confidenceScore = 0-100 confidence in the finding
overallConfidence = overall analysis confidence`,
    userPrompt: `Detect winning patterns from this competitor intelligence data:

CTAs used: ${summary.ctas.slice(0, 20).join(", ")}
Offer types: ${summary.offers.slice(0, 20).join(", ")}
Hook types: ${summary.hooks.slice(0, 20).join(", ")}
Colors: ${summary.colors.slice(0, 20).join(", ")}
Messaging themes: ${summary.messaging.slice(0, 10).join(" | ")}
Target audiences: ${summary.audiences.slice(0, 5).join(" | ")}
Landing page types: ${summary.landingPages.slice(0, 5).join(" | ")}
Creative types: ${summary.creativeTypes.slice(0, 20).join(", ")}`,
    maxTokens: 2000,
  });

  return result;
}
