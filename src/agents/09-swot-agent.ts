import { callClaude } from "@/lib/anthropic";
import { Competitor, SWOT, WebsiteResearch } from "@/lib/types";

export async function runSWOTAgent(
  competitors: Competitor[],
  websiteData: WebsiteResearch[]
): Promise<SWOT[]> {
  const competitorProfiles = competitors.map((c) => {
    const website = websiteData.find((w) => w.competitor === c.name);
    return {
      name: c.name,
      description: c.description,
      usp: website?.usp || "Unknown",
      targetAudience: website?.targetAudience || "Unknown",
      pricing: website?.pricing || "Unknown",
      trustSignals: website?.trustSignals || [],
    };
  });

  const result = await callClaude<{ swots: SWOT[] }>({
    systemPrompt: `You are a SWOT analysis agent. Generate a SWOT analysis for each competitor.

Return ONLY valid JSON: {"swots": [...]}

Each SWOT:
{
  "competitor": "name",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "opportunities": ["opportunity1", "opportunity2"],
  "threats": ["threat1", "threat2"]
}

Be specific and insightful. Based on real market knowledge. 3-4 items per quadrant.`,
    userPrompt: `Generate SWOT analysis for these competitors:

${competitorProfiles
  .map(
    (p) => `${p.name}:
  Description: ${p.description}
  USP: ${p.usp}
  Target: ${p.targetAudience}
  Pricing: ${p.pricing}
  Trust: ${p.trustSignals.slice(0, 3).join(", ")}`
  )
  .join("\n\n")}`,
    maxTokens: 4000,
  });

  return result.swots || [];
}
