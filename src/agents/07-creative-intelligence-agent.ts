import { callClaude } from "@/lib/anthropic";
import { Ad, Competitor, CreativeInsight } from "@/lib/types";

export async function runCreativeIntelligenceAgent(
  competitors: Competitor[],
  ads: Ad[]
): Promise<CreativeInsight[]> {
  const adsGrouped = competitors.map((c) => ({
    competitor: c.name,
    ads: ads.filter((a) => a.competitor === c.name),
  }));

  const result = await callClaude<{ insights: CreativeInsight[] }>({
    systemPrompt: `You are a creative intelligence agent. Analyze the creative strategy of each competitor.

Return ONLY valid JSON: {"insights": [...]}

Each insight:
{
  "competitor": "name",
  "imageStyle": "e.g. lifestyle photography, product-focused, user-generated",
  "videoStyle": "e.g. testimonial, demo, cinematic, UGC",
  "layout": "e.g. hero-centric, product grid, narrative scroll",
  "colors": ["primary colors used"],
  "typography": "e.g. bold sans-serif, elegant serif",
  "ctaPlacement": "e.g. above fold, sticky header, multiple CTAs",
  "designStyle": "e.g. minimalist, bold, corporate, playful",
  "usesTestimonials": true,
  "usesSocialProof": true,
  "usesAnimations": false,
  "creativeDirection": "overall creative direction description",
  "keyAngles": ["angle 1", "angle 2", "angle 3"]
}

Base on real knowledge of these brands. Use "Unknown" where not determinable.`,
    userPrompt: `Analyze the creative strategies for these competitors:

${adsGrouped
  .map(
    (g) =>
      `${g.competitor}:
  Ad types: ${[...new Set(g.ads.map((a) => a.creativeType))].join(", ") || "Unknown"}
  Platforms: ${[...new Set(g.ads.map((a) => a.platform))].join(", ") || "Unknown"}
  Sample headlines: ${g.ads
    .slice(0, 3)
    .map((a) => `"${a.headline}"`)
    .join(", ") || "Unknown"}`
  )
  .join("\n\n")}`,
    maxTokens: 4000,
  });

  return result.insights || [];
}
