import { callClaude } from "@/lib/anthropic";
import {
  CompetitorReport,
  NormalizedInput,
  Competitor,
  WebsiteResearch,
  Ad,
  Hook,
  Offer,
  CreativeInsight,
  WinningPatterns,
  SWOT,
  Recommendations,
} from "@/lib/types";

interface ReportInput {
  input: NormalizedInput;
  competitors: Competitor[];
  websiteResearch: WebsiteResearch[];
  ads: Ad[];
  hooks: Hook[];
  offers: Offer[];
  creativeInsights: CreativeInsight[];
  winningPatterns: WinningPatterns;
  swot: SWOT[];
  recommendations: Recommendations;
}

export async function runReportGeneratorAgent(
  data: ReportInput
): Promise<Pick<CompetitorReport, "executiveSummary" | "conclusion">> {
  const result = await callClaude<{
    executiveSummary: string;
    conclusion: string;
  }>({
    systemPrompt: `You are a competitive intelligence report writer. Generate professional executive summary and conclusion sections.
Return ONLY valid JSON: {"executiveSummary": "...", "conclusion": "..."}

Both should be 2-4 paragraphs each. Professional tone. Include specific insights from the data.`,
    userPrompt: `Generate executive summary and conclusion for this competitor analysis report.

Market/Niche: "${data.input.value}" (${data.input.type})
Competitors analyzed: ${data.competitors.map((c) => c.name).join(", ")}
Total ads analyzed: ${data.ads.length}
Top hooks found: ${data.hooks.slice(0, 3).map((h) => `"${h.text}"`).join(", ")}
Top offers: ${data.offers.slice(0, 3).map((o) => o.description).join(", ")}
Overall confidence: ${data.winningPatterns.overallConfidence}%
Quick wins identified: ${data.recommendations.quickWins.slice(0, 3).join(", ")}`,
    maxTokens: 2000,
  });

  return result;
}
