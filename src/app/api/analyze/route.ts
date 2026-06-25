import { NextRequest } from "next/server";
import { runInputAgent } from "@/agents/01-input-agent";
import { runCompetitorDiscoveryAgent } from "@/agents/02-competitor-discovery-agent";
import { runWebsiteResearchAgent } from "@/agents/03-website-research-agent";
import { runAdvertisingIntelligenceAgent } from "@/agents/04-advertising-intelligence-agent";
import { runHookAnalyzerAgent } from "@/agents/05-hook-analyzer-agent";
import { runOfferAnalyzerAgent } from "@/agents/06-offer-analyzer-agent";
import { runCreativeIntelligenceAgent } from "@/agents/07-creative-intelligence-agent";
import { runWinningPatternAgent } from "@/agents/08-winning-pattern-agent";
import { runSWOTAgent } from "@/agents/09-swot-agent";
import { runRecommendationAgent } from "@/agents/10-recommendation-agent";
import { runReportGeneratorAgent } from "@/agents/11-report-generator-agent";
import { CompetitorReport, StreamEvent } from "@/lib/types";

function encode(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  if (!input || typeof input !== "string" || input.trim().length < 2) {
    return new Response(JSON.stringify({ error: "Invalid input" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: StreamEvent) => {
        try {
          controller.enqueue(new TextEncoder().encode(encode(event)));
        } catch {
          // Stream closed
        }
      };

      const log = (message: string, level: StreamEvent["level"] = "info") =>
        send({ type: "log", message, level });

      try {
        // ── Step 1: Validate Input ─────────────────────────────────────────
        send({ type: "progress", step: "Validating input", stepNumber: 1, totalSteps: 10 });
        log("Initializing analysis engine...");
        log(`Processing input: "${input.trim()}"`, "info");

        const normalizedInput = await runInputAgent(input.trim());
        log(`Input classified as: ${normalizedInput.type} → "${normalizedInput.value}"`, "success");

        // ── Step 2: Discover Competitors ───────────────────────────────────
        send({ type: "progress", step: "Discovering competitors", stepNumber: 2, totalSteps: 10 });
        log("Searching for top competitors...");

        const competitors = await runCompetitorDiscoveryAgent(normalizedInput);
        competitors.forEach((c) => log(`Found competitor: ${c.name} (${c.website})`, "success"));
        log(`Discovered ${competitors.length} competitors`, "success");

        if (competitors.length === 0) {
          send({ type: "error", message: "No competitors found. Try a different input." });
          controller.close();
          return;
        }

        // ── Steps 3-7: Parallel Research ──────────────────────────────────
        send({ type: "progress", step: "Researching websites & ads", stepNumber: 3, totalSteps: 10 });
        log("Launching parallel research agents...");
        log("Scraping competitor websites...");
        log("Analyzing advertising platforms...");

        const [websiteResearch, ads] = await Promise.all([
          runWebsiteResearchAgent(competitors).then((r) => {
            log(`Scraped ${r.length} competitor websites`, "success");
            return r;
          }),
          runAdvertisingIntelligenceAgent(competitors, normalizedInput).then((r) => {
            log(`Analyzed ${r.length} competitor ads across platforms`, "success");
            return r;
          }),
        ]);

        // ── Step 4: Parallel Analysis ──────────────────────────────────────
        send({ type: "progress", step: "Analyzing hooks, offers & creatives", stepNumber: 4, totalSteps: 10 });
        log("Running hook analyzer...");
        log("Running offer analyzer...");
        log("Running creative intelligence agent...");

        const [hooks, offers, creativeInsights] = await Promise.all([
          runHookAnalyzerAgent(websiteResearch, ads).then((r) => {
            log(`Extracted ${r.length} marketing hooks`, "success");
            return r;
          }),
          runOfferAnalyzerAgent(websiteResearch, ads).then((r) => {
            log(`Found ${r.length} competitor offers`, "success");
            return r;
          }),
          runCreativeIntelligenceAgent(competitors, ads).then((r) => {
            log(`Analyzed ${r.length} creative strategies`, "success");
            return r;
          }),
        ]);

        // ── Step 5: Detect Winning Patterns ───────────────────────────────
        send({ type: "progress", step: "Detecting winning patterns", stepNumber: 5, totalSteps: 10 });
        log("Identifying winning patterns across competitors...");

        const winningPatterns = await runWinningPatternAgent(
          websiteResearch, ads, hooks, offers
        );
        log(`Patterns detected with ${winningPatterns.overallConfidence}% confidence`, "success");

        // ── Step 6: SWOT Analysis ──────────────────────────────────────────
        send({ type: "progress", step: "Running SWOT analysis", stepNumber: 6, totalSteps: 10 });
        log("Generating SWOT analysis for each competitor...");

        const swot = await runSWOTAgent(competitors, websiteResearch);
        log(`SWOT analysis complete for ${swot.length} competitors`, "success");

        // ── Step 7: Recommendations ────────────────────────────────────────
        send({ type: "progress", step: "Generating recommendations", stepNumber: 7, totalSteps: 10 });
        log("Generating strategic recommendations...");

        const recommendations = await runRecommendationAgent(
          normalizedInput, hooks, offers, winningPatterns
        );
        log(`Generated ${recommendations.quickWins.length} quick wins`, "success");

        // ── Step 8: Generate Report ────────────────────────────────────────
        send({ type: "progress", step: "Generating report", stepNumber: 8, totalSteps: 10 });
        log("Compiling final intelligence report...");

        const reportSections = await runReportGeneratorAgent({
          input: normalizedInput,
          competitors,
          websiteResearch,
          ads,
          hooks,
          offers,
          creativeInsights,
          winningPatterns,
          swot,
          recommendations,
        });

        // ── Step 9: Assemble Final Report ─────────────────────────────────
        send({ type: "progress", step: "Finalizing report", stepNumber: 9, totalSteps: 10 });
        log("Assembling complete competitor intelligence report...");

        const report: CompetitorReport = {
          input: normalizedInput,
          generatedAt: new Date().toISOString(),
          executiveSummary: reportSections.executiveSummary,
          competitors,
          websiteResearch,
          ads,
          hooks,
          offers,
          creativeInsights,
          winningPatterns,
          swot,
          recommendations,
          conclusion: reportSections.conclusion,
        };

        // ── Step 10: Done ─────────────────────────────────────────────────
        send({ type: "progress", step: "Complete", stepNumber: 10, totalSteps: 10 });
        log("Analysis complete! Rendering report...", "success");
        log(`Report: ${competitors.length} competitors | ${ads.length} ads | ${hooks.length} hooks | ${offers.length} offers`, "success");

        send({ type: "result", data: report });
        send({ type: "done" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Analysis failed";
        send({ type: "error", message });
        log(`Error: ${message}`, "error");
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
