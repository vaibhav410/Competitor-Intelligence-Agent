import { callClaude } from "@/lib/anthropic";
import { Ad, Hook, WebsiteResearch } from "@/lib/types";

export async function runHookAnalyzerAgent(
  websiteData: WebsiteResearch[],
  ads: Ad[]
): Promise<Hook[]> {
  const websiteSummary = websiteData
    .slice(0, 5)
    .map(
      (w) =>
        `${w.competitor}: Hero="${w.heroHeading}" | USP="${w.usp}" | CTA="${w.cta}"`
    )
    .join("\n");

  const adSummary = ads
    .slice(0, 20)
    .map(
      (a) =>
        `${a.competitor} [${a.platform}]: "${a.headline}" | "${a.primaryText.slice(0, 100)}"`
    )
    .join("\n");

  const result = await callClaude<{ hooks: Hook[] }>({
    systemPrompt: `You are a marketing hook analyzer. Extract and identify the top 20 marketing hooks used by competitors.

Hook types: pain, curiosity, authority, benefit, urgency, question, emotional

Return ONLY valid JSON: {"hooks": [...]}

Each hook:
{
  "type": "pain|curiosity|authority|benefit|urgency|question|emotional",
  "text": "the actual hook text",
  "competitor": "which competitor uses it",
  "platform": "website|meta|google|tiktok|instagram|youtube",
  "strength": 7 // 1-10 rating
}

Return top 20 hooks ordered by strength (highest first). Focus on real, impactful hooks.`,
    userPrompt: `Analyze these competitor marketing messages and extract the top hooks:

WEBSITE DATA:
${websiteSummary}

AD DATA:
${adSummary}

Extract the 20 strongest marketing hooks.`,
    maxTokens: 3000,
  });

  return (result.hooks || []).slice(0, 20);
}
