import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ClaudeCallOptions {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export async function callClaude<T>(options: ClaudeCallOptions): Promise<T> {
  const { systemPrompt, userPrompt, maxTokens = 4096 } = options;

  const attempt = async (): Promise<T> => {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from the response
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ||
      text.match(/\{[\s\S]*\}/) ||
      text.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr) as T;
    }

    // Try parsing the whole text as JSON
    return JSON.parse(text) as T;
  };

  try {
    return await attempt();
  } catch {
    // Retry once on failure
    try {
      await new Promise((r) => setTimeout(r, 1000));
      return await attempt();
    } catch (err) {
      throw new Error(
        `Claude call failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
}

export default client;
