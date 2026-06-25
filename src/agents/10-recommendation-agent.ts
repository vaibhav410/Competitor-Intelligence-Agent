import { callClaude } from "@/lib/anthropic";
import {
  Hook,
  NormalizedInput,
  Offer,
  Recommendations,
  WinningPatterns,
} from "@/lib/types";

export async function runRecommendationAgent(
  input: NormalizedInput,
  hooks: Hook[],
  offers: Offer[],
  patterns: WinningPatterns
): Promise<Recommendations> {
  const topHooks = hooks
    .slice(0, 5)
    .map((h) => `"${h.text}" (${h.type})`)
    .join("\n");
  const topOffers = offers
    .slice(0, 5)
    .map((o) => `${o.type}: ${o.description}`)
    .join("\n");

  const result = await callClaude<Recommendations>({
    systemPrompt: `You are a growth marketing strategist. Based on competitor intelligence, generate actionable recommendations.

Return ONLY valid JSON:
{
  "howToBeatCompetitors": ["actionable strategy 1", "2", "3", "4", "5"],
  "landingPageIdeas": ["LP idea 1", "2", "3"],
  "offerIdeas": ["offer 1", "2", "3"],
  "adIdeas": ["ad concept 1", "2", "3"],
  "contentIdeas": ["content 1", "2", "3"],
  "emailIdeas": ["email 1", "2", "3"],
  "creativeIdeas": ["creative 1", "2", "3"],
  "growthOpportunities": ["opportunity 1", "2", "3"],
  "quickWins": ["quick win 1 (can do this week)", "2", "3"]
}

Be specific and actionable. Not generic advice.`,
    userPrompt: `Generate recommendations for entering/winning in the "${input.value}" market.

Winning pattern: ${patterns.mostCommonOffer.pattern} (${patterns.mostCommonOffer.confidenceScore}% confidence)
Most effective hook type: ${patterns.mostCommonHook.pattern}
Most common CTA: ${patterns.mostCommonCTA.pattern}
Top competitor messaging: ${patterns.mostCommonMessaging.pattern}

Top competitor hooks:
${topHooks}

Top competitor offers:
${topOffers}

Generate differentiated recommendations that would outperform the competition.`,
    maxTokens: 3000,
  });

  return result;
}
