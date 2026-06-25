import { callClaude } from "@/lib/anthropic";
import { Competitor, NormalizedInput } from "@/lib/types";

export async function runCompetitorDiscoveryAgent(
  input: NormalizedInput
): Promise<Competitor[]> {
  const result = await callClaude<{ competitors: Competitor[] }>({
    systemPrompt: `You are a competitor discovery agent. Find the top competitors for a given brand, website, product, or niche.
Return ONLY valid JSON: {"competitors": [...]}

Each competitor object must have:
- name: string (company name)
- website: string (domain only, e.g. "nike.com")
- description: string (1-2 sentence description)
- category: string (industry category)

Return maximum 8 competitors. Only return real, well-known companies. Never hallucinate.
If you don't know a competitor, skip it. Return empty array rather than fake data.`,
    userPrompt: `Find the top competitors for: ${input.type} = "${input.value}"

Consider direct competitors in the same market segment. Focus on the most relevant ones.`,
    maxTokens: 2000,
  });

  return result.competitors.slice(0, 8);
}
