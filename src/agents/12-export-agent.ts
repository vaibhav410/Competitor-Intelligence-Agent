import { CompetitorReport } from "@/lib/types";

// ─── JSON Export ──────────────────────────────────────────────────────────────
export function exportToJSON(report: CompetitorReport): string {
  return JSON.stringify(report, null, 2);
}

// ─── CSV Export ───────────────────────────────────────────────────────────────
export function exportToCSV(report: CompetitorReport): string {
  const sections: string[] = [];

  // Competitors sheet
  sections.push("=== COMPETITORS ===");
  sections.push("Name,Website,Description,Category");
  report.competitors.forEach((c) => {
    sections.push(
      `"${c.name}","${c.website}","${c.description.replace(/"/g, "'")}","${c.category}"`
    );
  });

  sections.push("\n=== HOOKS (Top 20) ===");
  sections.push("Type,Text,Competitor,Platform,Strength");
  report.hooks.forEach((h) => {
    sections.push(
      `"${h.type}","${h.text.replace(/"/g, "'")}","${h.competitor}","${h.platform}","${h.strength}"`
    );
  });

  sections.push("\n=== OFFERS ===");
  sections.push("Type,Description,Competitor,Value");
  report.offers.forEach((o) => {
    sections.push(
      `"${o.type}","${o.description.replace(/"/g, "'")}","${o.competitor}","${o.value}"`
    );
  });

  sections.push("\n=== WINNING PATTERNS ===");
  sections.push("Category,Pattern,Frequency,Confidence");
  const patterns = [
    report.winningPatterns.mostCommonOffer,
    report.winningPatterns.mostCommonCTA,
    report.winningPatterns.mostCommonHook,
    report.winningPatterns.mostCommonMessaging,
    report.winningPatterns.mostCommonCreative,
  ];
  patterns.forEach((p) => {
    sections.push(
      `"${p.category}","${p.pattern.replace(/"/g, "'")}","${p.frequency}","${p.confidenceScore}%"`
    );
  });

  sections.push("\n=== RECOMMENDATIONS ===");
  sections.push("Category,Recommendation");
  report.recommendations.howToBeatCompetitors.forEach((r) =>
    sections.push(`"How to Beat Competitors","${r.replace(/"/g, "'")}"`)
  );
  report.recommendations.quickWins.forEach((r) =>
    sections.push(`"Quick Win","${r.replace(/"/g, "'")}"`)
  );
  report.recommendations.adIdeas.forEach((r) =>
    sections.push(`"Ad Idea","${r.replace(/"/g, "'")}"`)
  );

  return sections.join("\n");
}

// ─── PDF HTML Generator (rendered client-side) ────────────────────────────────
export function generatePDFHTML(report: CompetitorReport): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Competitor Intelligence Report - ${report.input.value}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #1a1a2e; line-height: 1.6; }
  .cover { background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); color: white; padding: 80px 60px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
  .cover h1 { font-size: 48px; font-weight: 800; margin-bottom: 16px; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .cover .subtitle { font-size: 24px; color: #a0a0b0; margin-bottom: 40px; }
  .cover .meta { font-size: 14px; color: #606080; }
  .page { padding: 60px; page-break-before: always; }
  h2 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 3px solid #6366f1; }
  h3 { font-size: 18px; font-weight: 600; color: #2d2d50; margin: 24px 0 12px; }
  p { color: #4a4a6a; margin-bottom: 12px; }
  .section { margin-bottom: 48px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th { background: #6366f1; color: white; padding: 10px 14px; text-align: left; font-size: 13px; }
  td { padding: 10px 14px; border-bottom: 1px solid #e8e8f0; font-size: 13px; }
  tr:nth-child(even) td { background: #f8f8ff; }
  .tag { display: inline-block; background: #ede9fe; color: #6366f1; padding: 3px 10px; border-radius: 20px; font-size: 12px; margin: 2px; }
  .score { background: #6366f1; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
  .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
  .swot-box { padding: 16px; border-radius: 8px; }
  .swot-s { background: #d1fae5; border-left: 4px solid #10b981; }
  .swot-w { background: #fee2e2; border-left: 4px solid #ef4444; }
  .swot-o { background: #dbeafe; border-left: 4px solid #3b82f6; }
  .swot-t { background: #fef3c7; border-left: 4px solid #f59e0b; }
  .swot-box h4 { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
  .swot-box ul { padding-left: 16px; }
  .swot-box li { font-size: 13px; margin-bottom: 4px; }
  .rec-item { background: #f8f8ff; border-left: 4px solid #6366f1; padding: 12px 16px; margin-bottom: 8px; border-radius: 0 8px 8px 0; font-size: 14px; }
  .footer { text-align: center; color: #9090a0; font-size: 12px; padding: 20px; border-top: 1px solid #e8e8f0; margin-top: 40px; }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="tag" style="background:#312e81;color:#a5b4fc;margin-bottom:24px;display:inline-block">COMPETITOR INTELLIGENCE REPORT</div>
  <h1>Creative Strategist</h1>
  <div class="subtitle">${report.input.value}</div>
  <p style="color:#8080a0;max-width:500px">${report.executiveSummary.slice(0, 200)}...</p>
  <div class="meta" style="margin-top:48px">
    Generated: ${new Date(report.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} |
    Competitors: ${report.competitors.length} |
    Ads Analyzed: ${report.ads.length} |
    Confidence: ${report.winningPatterns.overallConfidence}%
  </div>
</div>

<!-- EXECUTIVE SUMMARY -->
<div class="page">
  <div class="section">
    <h2>Executive Summary</h2>
    <p>${report.executiveSummary}</p>
  </div>

  <!-- COMPETITORS -->
  <div class="section">
    <h2>Competitors Analyzed</h2>
    <table>
      <thead><tr><th>Company</th><th>Website</th><th>Category</th><th>Description</th></tr></thead>
      <tbody>
        ${report.competitors.map((c) => `<tr><td><strong>${c.name}</strong></td><td>${c.website}</td><td><span class="tag">${c.category}</span></td><td>${c.description}</td></tr>`).join("")}
      </tbody>
    </table>
  </div>
</div>

<!-- TOP HOOKS -->
<div class="page">
  <div class="section">
    <h2>Top Marketing Hooks</h2>
    <table>
      <thead><tr><th>Type</th><th>Hook</th><th>Competitor</th><th>Strength</th></tr></thead>
      <tbody>
        ${report.hooks.slice(0, 20).map((h) => `<tr><td><span class="tag">${h.type}</span></td><td>${h.text}</td><td>${h.competitor}</td><td><span class="score">${h.strength}/10</span></td></tr>`).join("")}
      </tbody>
    </table>
  </div>

  <!-- OFFERS -->
  <div class="section">
    <h2>Competitor Offers</h2>
    <table>
      <thead><tr><th>Type</th><th>Description</th><th>Competitor</th><th>Value</th></tr></thead>
      <tbody>
        ${report.offers.slice(0, 15).map((o) => `<tr><td><span class="tag">${o.type}</span></td><td>${o.description}</td><td>${o.competitor}</td><td>${o.value}</td></tr>`).join("")}
      </tbody>
    </table>
  </div>
</div>

<!-- WINNING PATTERNS -->
<div class="page">
  <div class="section">
    <h2>Winning Patterns</h2>
    <table>
      <thead><tr><th>Category</th><th>Pattern</th><th>Frequency</th><th>Confidence</th></tr></thead>
      <tbody>
        ${[
          report.winningPatterns.mostCommonOffer,
          report.winningPatterns.mostCommonCTA,
          report.winningPatterns.mostCommonHook,
          report.winningPatterns.mostCommonMessaging,
          report.winningPatterns.mostCommonCreative,
          report.winningPatterns.mostCommonColors,
          report.winningPatterns.mostCommonAudience,
          report.winningPatterns.mostCommonLandingPage,
        ]
          .map((p) => `<tr><td><strong>${p.category}</strong></td><td>${p.pattern}</td><td>${p.frequency} competitors</td><td><span class="score">${p.confidenceScore}%</span></td></tr>`)
          .join("")}
      </tbody>
    </table>
  </div>
</div>

<!-- SWOT -->
<div class="page">
  <div class="section">
    <h2>SWOT Analysis</h2>
    ${report.swot.map((s) => `
      <h3>${s.competitor}</h3>
      <div class="swot-grid">
        <div class="swot-box swot-s"><h4>Strengths</h4><ul>${s.strengths.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="swot-box swot-w"><h4>Weaknesses</h4><ul>${s.weaknesses.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="swot-box swot-o"><h4>Opportunities</h4><ul>${s.opportunities.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="swot-box swot-t"><h4>Threats</h4><ul>${s.threats.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      </div>
    `).join("")}
  </div>
</div>

<!-- RECOMMENDATIONS -->
<div class="page">
  <div class="section">
    <h2>Strategic Recommendations</h2>

    <h3>How to Beat Competitors</h3>
    ${report.recommendations.howToBeatCompetitors.map((r) => `<div class="rec-item">${r}</div>`).join("")}

    <h3>Quick Wins</h3>
    ${report.recommendations.quickWins.map((r) => `<div class="rec-item">${r}</div>`).join("")}

    <h3>Ad Ideas</h3>
    ${report.recommendations.adIdeas.map((r) => `<div class="rec-item">${r}</div>`).join("")}

    <h3>Growth Opportunities</h3>
    ${report.recommendations.growthOpportunities.map((r) => `<div class="rec-item">${r}</div>`).join("")}
  </div>

  <!-- CONCLUSION -->
  <div class="section">
    <h2>Conclusion</h2>
    <p>${report.conclusion}</p>
  </div>

  <div class="footer">
    Creative Strategist — Competitor Intelligence Report | ${report.input.value} | ${new Date(report.generatedAt).toLocaleDateString()}
  </div>
</div>

</body>
</html>`;
}
