import { callClaude } from "@/lib/anthropic";
import { InputType, NormalizedInput } from "@/lib/types";

export async function runInputAgent(
  rawInput: string
): Promise<NormalizedInput> {
  const result = await callClaude<{ type: InputType; value: string }>({
    systemPrompt: `You are an input classification agent. Classify user input into one of: website, brand, product, niche.
Return ONLY valid JSON: {"type": "website|brand|product|niche", "value": "normalized value"}

Rules:
- website: if it looks like a domain (has .com/.io/.co/etc) → normalize to domain only, no https://
- brand: if it's a recognizable company/brand name
- product: if it describes a specific product (e.g. "protein powder", "running shoes")
- niche: if it's a market category or professional niche (e.g. "dentists in London", "digital marketing agency")`,
    userPrompt: `Classify this input: "${rawInput}"`,
    maxTokens: 200,
  });

  return {
    type: result.type,
    value: result.value,
    originalValue: rawInput,
  };
}
