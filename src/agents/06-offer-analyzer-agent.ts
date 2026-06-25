import { callClaude } from "@/lib/anthropic";
import { Ad, Offer, WebsiteResearch } from "@/lib/types";

export async function runOfferAnalyzerAgent(
  websiteData: WebsiteResearch[],
  ads: Ad[]
): Promise<Offer[]> {
  const websiteOffers = websiteData
    .map((w) => `${w.competitor}: offers=[${w.offers.join(", ")}] pricing=${w.pricing}`)
    .join("\n");

  const adOffers = ads
    .map((a) => `${a.competitor} [${a.platform}]: offer="${a.offer}"`)
    .join("\n");

  const result = await callClaude<{ offers: Offer[] }>({
    systemPrompt: `You are an offer intelligence agent. Extract all competitor offers and promotions.

Return ONLY valid JSON: {"offers": [...]}

Each offer:
{
  "type": "discount|bundle|coupon|free_shipping|guarantee|trial|refund|upsell|crosssell",
  "description": "full description of the offer",
  "competitor": "company name",
  "value": "specific value (e.g. '20% off', '30-day trial', 'Free shipping on orders $50+')",
  "sourceUrl": "Unknown"
}

Extract every unique offer. Be specific about the value. Never fabricate - use "Unknown" if value is unclear.`,
    userPrompt: `Extract all offers from these competitor data points:

WEBSITE OFFERS:
${websiteOffers}

AD OFFERS:
${adOffers}`,
    maxTokens: 3000,
  });

  return result.offers || [];
}
