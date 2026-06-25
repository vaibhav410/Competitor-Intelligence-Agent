import { callClaude } from "@/lib/anthropic";
import { Ad, Competitor, NormalizedInput } from "@/lib/types";

export async function runAdvertisingIntelligenceAgent(
  competitors: Competitor[],
  input: NormalizedInput
): Promise<Ad[]> {
  const competitorList = competitors
    .map((c) => `- ${c.name} (${c.website})`)
    .join("\n");

  const result = await callClaude<{ ads: Ad[] }>({
    systemPrompt: `You are an advertising intelligence agent. Based on knowledge of these brands and the market niche, generate a realistic analysis of their advertising strategies across platforms.
Return ONLY valid JSON: {"ads": [...]}

Each ad object:
{
  "competitor": "company name",
  "platform": "meta|google|tiktok|instagram|youtube",
  "headline": "ad headline",
  "primaryText": "main ad copy",
  "cta": "call to action button text",
  "offer": "specific offer in the ad",
  "creativeType": "image|video|carousel|text",
  "landingPage": "type of landing page used",
  "duration": "video length or N/A",
  "messaging": "core message/angle",
  "sourceUrl": "Unknown"
}

Return 3-5 ads per competitor across different platforms. Base on real knowledge of these brands' advertising. Never completely fabricate - use Unknown where uncertain.`,
    userPrompt: `Analyze the advertising strategies for these competitors in the "${input.value}" space:

${competitorList}

Generate realistic ad intelligence based on their known marketing approach.`,
    maxTokens: 4000,
  });

  return result.ads || [];
}
