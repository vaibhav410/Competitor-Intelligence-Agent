import { callClaude } from "@/lib/anthropic";
import { scrapeWebsite } from "@/lib/apify";
import { Competitor, WebsiteResearch } from "@/lib/types";

async function researchSingleWebsite(
  competitor: Competitor
): Promise<WebsiteResearch> {
  const scraped = await scrapeWebsite(competitor.website);

  const result = await callClaude<Omit<WebsiteResearch, "competitor" | "website" | "sourceUrl">>({
    systemPrompt: `You are a website research agent. Analyze the scraped content from a competitor website and extract structured marketing intelligence.
Return ONLY valid JSON matching this exact structure:
{
  "heroHeading": "string or Unknown",
  "heroSubtitle": "string or Unknown",
  "cta": "string or Unknown",
  "products": ["array of products/services"],
  "services": ["array of services"],
  "pricing": "string description or Unknown",
  "offers": ["array of current offers"],
  "navigation": ["nav items"],
  "testimonials": ["testimonial snippets"],
  "faq": ["faq items"],
  "trustSignals": ["trust badges, certifications, etc"],
  "brandTone": "string (e.g. professional, friendly, bold)",
  "targetAudience": "string description",
  "usp": "main unique selling proposition",
  "landingPageStructure": "description of page layout",
  "colors": ["brand colors mentioned or inferred"],
  "typography": "font style description",
  "socialLinks": ["platforms they're on"],
  "newsletter": false
}

Never hallucinate. Use "Unknown" if not determinable from the content.`,
    userPrompt: `Website: ${competitor.website}
Company: ${competitor.name}

Scraped Content:
Title: ${scraped.title || "Unknown"}
Description: ${scraped.description || "Unknown"}

${scraped.text || "No content available"}`,
    maxTokens: 2000,
  });

  return {
    ...result,
    competitor: competitor.name,
    website: competitor.website,
    sourceUrl: `https://${competitor.website}`,
  };
}

export async function runWebsiteResearchAgent(
  competitors: Competitor[]
): Promise<WebsiteResearch[]> {
  const results = await Promise.allSettled(
    competitors.map((c) => researchSingleWebsite(c))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<WebsiteResearch> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);
}
