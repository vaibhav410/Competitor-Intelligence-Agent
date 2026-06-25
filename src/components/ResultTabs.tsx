"use client";

import { useState } from "react";
import { CompetitorReport, Hook, Offer, SWOT } from "@/lib/types";
import ExportButtons from "./ExportButtons";

interface Props {
  report: CompetitorReport;
}

const TABS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "competitors", label: "Competitors", icon: "🏢" },
  { id: "ads", label: "Ads", icon: "📢" },
  { id: "hooks", label: "Hooks", icon: "🎣" },
  { id: "offers", label: "Offers", icon: "🏷️" },
  { id: "creatives", label: "Creatives", icon: "🎨" },
  { id: "patterns", label: "Patterns", icon: "🔮" },
  { id: "swot", label: "SWOT", icon: "⚔️" },
  { id: "recommendations", label: "Recommendations", icon: "💡" },
  { id: "export", label: "Export", icon: "📥" },
];

const HOOK_COLORS: Record<string, string> = {
  pain: "bg-red-900/30 text-red-400 border-red-800/50",
  curiosity: "bg-purple-900/30 text-purple-400 border-purple-800/50",
  authority: "bg-blue-900/30 text-blue-400 border-blue-800/50",
  benefit: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50",
  urgency: "bg-orange-900/30 text-orange-400 border-orange-800/50",
  question: "bg-cyan-900/30 text-cyan-400 border-cyan-800/50",
  emotional: "bg-pink-900/30 text-pink-400 border-pink-800/50",
};

const OFFER_COLORS: Record<string, string> = {
  discount: "bg-rose-900/30 text-rose-400",
  bundle: "bg-purple-900/30 text-purple-400",
  coupon: "bg-amber-900/30 text-amber-400",
  free_shipping: "bg-blue-900/30 text-blue-400",
  guarantee: "bg-emerald-900/30 text-emerald-400",
  trial: "bg-cyan-900/30 text-cyan-400",
  refund: "bg-indigo-900/30 text-indigo-400",
  upsell: "bg-orange-900/30 text-orange-400",
  crosssell: "bg-pink-900/30 text-pink-400",
};

function Badge({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {text}
    </span>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-900/60 border border-gray-800/50 rounded-xl p-5 ${className || ""}`}>
      {children}
    </div>
  );
}

function ScoreBar({ score, label }: { score: number; label?: string }) {
  return (
    <div className="space-y-1">
      {label && <div className="text-gray-500 text-xs">{label}</div>}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-white text-xs font-mono w-8 text-right">{score}%</span>
      </div>
    </div>
  );
}

// ─── Tab Panels ───────────────────────────────────────────────────────────────
function OverviewPanel({ report }: { report: CompetitorReport }) {
  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span>📋</span> Executive Summary
        </h3>
        <p className="text-gray-400 leading-relaxed">{report.executiveSummary}</p>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Competitors", value: report.competitors.length, icon: "🏢" },
          { label: "Ads Analyzed", value: report.ads.length, icon: "📢" },
          { label: "Hooks Found", value: report.hooks.length, icon: "🎣" },
          { label: "Offers Found", value: report.offers.length, icon: "🏷️" },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Confidence */}
      <Card>
        <h3 className="text-white font-semibold mb-4">Analysis Confidence</h3>
        <ScoreBar score={report.winningPatterns.overallConfidence} label="Overall Confidence" />
      </Card>

      {/* Conclusion */}
      <Card>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span>🎯</span> Conclusion
        </h3>
        <p className="text-gray-400 leading-relaxed">{report.conclusion}</p>
      </Card>
    </div>
  );
}

function CompetitorsPanel({ report }: { report: CompetitorReport }) {
  return (
    <div className="grid gap-4">
      {report.competitors.map((c) => {
        const ws = report.websiteResearch.find((w) => w.competitor === c.name);
        return (
          <Card key={c.name}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold text-lg">{c.name}</h3>
                  <Badge text={c.category} className="border-indigo-800/50 text-indigo-400 bg-indigo-900/30" />
                </div>
                <a href={`https://${c.website}`} target="_blank" rel="noopener noreferrer"
                  className="text-indigo-400 text-sm hover:underline">
                  {c.website} ↗
                </a>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">{c.description}</p>
            {ws && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-800/50">
                <div>
                  <div className="text-gray-600 text-xs mb-1">Hero Heading</div>
                  <div className="text-gray-300 text-sm">"{ws.heroHeading}"</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs mb-1">USP</div>
                  <div className="text-gray-300 text-sm">{ws.usp}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs mb-1">Target Audience</div>
                  <div className="text-gray-300 text-sm">{ws.targetAudience}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs mb-1">Brand Tone</div>
                  <div className="text-gray-300 text-sm">{ws.brandTone}</div>
                </div>
                {ws.trustSignals.length > 0 && (
                  <div className="col-span-2">
                    <div className="text-gray-600 text-xs mb-2">Trust Signals</div>
                    <div className="flex flex-wrap gap-1">
                      {ws.trustSignals.slice(0, 4).map((t, i) => (
                        <Badge key={i} text={t} className="border-gray-700 text-gray-400 bg-gray-800/50" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function AdsPanel({ report }: { report: CompetitorReport }) {
  const platforms = [...new Set(report.ads.map((a) => a.platform))];
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? report.ads : report.ads.filter((a) => a.platform === filter);

  const PLATFORM_COLORS: Record<string, string> = {
    meta: "bg-blue-900/30 text-blue-400 border-blue-800/50",
    google: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50",
    tiktok: "bg-pink-900/30 text-pink-400 border-pink-800/50",
    instagram: "bg-purple-900/30 text-purple-400 border-purple-800/50",
    youtube: "bg-red-900/30 text-red-400 border-red-800/50",
  };

  return (
    <div className="space-y-4">
      {/* Platform Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
        >
          All ({report.ads.length})
        </button>
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === p ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            {p} ({report.ads.filter((a) => a.platform === p).length})
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((ad, i) => (
          <Card key={i}>
            <div className="flex items-center gap-2 mb-3">
              <Badge text={ad.platform} className={PLATFORM_COLORS[ad.platform] || "border-gray-700 text-gray-400"} />
              <Badge text={ad.creativeType} className="border-gray-700 text-gray-500 bg-gray-800/50" />
              <span className="text-gray-600 text-sm ml-auto">{ad.competitor}</span>
            </div>
            <h4 className="text-white font-medium mb-2">{ad.headline}</h4>
            <p className="text-gray-400 text-sm mb-3">{ad.primaryText}</p>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-800/50">
              {ad.cta && <Badge text={`CTA: ${ad.cta}`} className="border-indigo-800/50 text-indigo-400 bg-indigo-900/30" />}
              {ad.offer && ad.offer !== "Unknown" && <Badge text={ad.offer} className="border-emerald-800/50 text-emerald-400 bg-emerald-900/30" />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function HooksPanel({ hooks }: { hooks: Hook[] }) {
  const types = [...new Set(hooks.map((h) => h.type))];
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? hooks : hooks.filter((h) => h.type === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
          All ({hooks.length})
        </button>
        {types.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === t ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((hook, i) => (
          <Card key={i} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {hook.strength}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge text={hook.type} className={HOOK_COLORS[hook.type] || "border-gray-700 text-gray-400"} />
                <span className="text-gray-600 text-xs">{hook.competitor}</span>
              </div>
              <p className="text-gray-200 font-medium">"{hook.text}"</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function OffersPanel({ offers }: { offers: Offer[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {offers.map((offer, i) => (
        <Card key={i}>
          <div className="flex items-start gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${OFFER_COLORS[offer.type] || "bg-gray-800 text-gray-400"}`}>
              {offer.type.replace("_", " ")}
            </span>
          </div>
          <p className="text-gray-200 font-medium mt-2 mb-1">{offer.description}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/50">
            <span className="text-indigo-400 text-sm font-medium">{offer.value}</span>
            <span className="text-gray-600 text-xs">{offer.competitor}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CreativesPanel({ report }: { report: CompetitorReport }) {
  return (
    <div className="grid gap-4">
      {report.creativeInsights.map((ci, i) => (
        <Card key={i}>
          <h3 className="text-white font-semibold mb-4">{ci.competitor}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600 text-xs mb-1">Design Style</div>
              <div className="text-gray-300">{ci.designStyle}</div>
            </div>
            <div>
              <div className="text-gray-600 text-xs mb-1">Image Style</div>
              <div className="text-gray-300">{ci.imageStyle}</div>
            </div>
            <div>
              <div className="text-gray-600 text-xs mb-1">CTA Placement</div>
              <div className="text-gray-300">{ci.ctaPlacement}</div>
            </div>
            <div>
              <div className="text-gray-600 text-xs mb-1">Typography</div>
              <div className="text-gray-300">{ci.typography}</div>
            </div>
            <div className="col-span-2">
              <div className="text-gray-600 text-xs mb-1">Creative Direction</div>
              <div className="text-gray-300">{ci.creativeDirection}</div>
            </div>
            {ci.keyAngles.length > 0 && (
              <div className="col-span-2">
                <div className="text-gray-600 text-xs mb-2">Key Creative Angles</div>
                <div className="flex flex-wrap gap-1">
                  {ci.keyAngles.map((a, j) => (
                    <Badge key={j} text={a} className="border-purple-800/50 text-purple-400 bg-purple-900/20" />
                  ))}
                </div>
              </div>
            )}
            <div className="col-span-2 flex gap-4">
              {ci.usesTestimonials && <Badge text="Uses Testimonials" className="border-emerald-800/50 text-emerald-400 bg-emerald-900/30" />}
              {ci.usesSocialProof && <Badge text="Social Proof" className="border-blue-800/50 text-blue-400 bg-blue-900/30" />}
              {ci.usesAnimations && <Badge text="Animations" className="border-orange-800/50 text-orange-400 bg-orange-900/30" />}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PatternsPanel({ report }: { report: CompetitorReport }) {
  const patterns = [
    report.winningPatterns.mostCommonOffer,
    report.winningPatterns.mostCommonCTA,
    report.winningPatterns.mostCommonHook,
    report.winningPatterns.mostCommonMessaging,
    report.winningPatterns.mostCommonCreative,
    report.winningPatterns.mostCommonColors,
    report.winningPatterns.mostCommonAudience,
    report.winningPatterns.mostCommonLandingPage,
  ];

  return (
    <div className="space-y-4">
      <Card>
        <ScoreBar score={report.winningPatterns.overallConfidence} label="Overall Analysis Confidence" />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {patterns.map((p, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between mb-2">
              <Badge text={p.category} className="border-indigo-800/50 text-indigo-400 bg-indigo-900/30" />
              <span className="text-xs text-gray-600">{p.frequency} competitors</span>
            </div>
            <p className="text-gray-200 font-medium mb-3">{p.pattern}</p>
            <ScoreBar score={p.confidenceScore} label="Confidence" />
            {p.examples.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-800/50">
                <div className="text-gray-600 text-xs mb-1">Examples:</div>
                <ul className="space-y-1">
                  {p.examples.slice(0, 2).map((ex, j) => (
                    <li key={j} className="text-gray-400 text-xs">• {ex}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function SWOTPanel({ swot }: { swot: SWOT[] }) {
  return (
    <div className="space-y-6">
      {swot.map((s, i) => (
        <div key={i}>
          <h3 className="text-white font-semibold mb-3">{s.competitor}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="border-emerald-900/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-400 font-medium text-sm">Strengths</span>
              </div>
              <ul className="space-y-1.5">
                {s.strengths.map((x, j) => <li key={j} className="text-gray-400 text-sm flex gap-2"><span className="text-emerald-600 mt-0.5">+</span>{x}</li>)}
              </ul>
            </Card>
            <Card className="border-red-900/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-red-400 font-medium text-sm">Weaknesses</span>
              </div>
              <ul className="space-y-1.5">
                {s.weaknesses.map((x, j) => <li key={j} className="text-gray-400 text-sm flex gap-2"><span className="text-red-600 mt-0.5">-</span>{x}</li>)}
              </ul>
            </Card>
            <Card className="border-blue-900/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-blue-400 font-medium text-sm">Opportunities</span>
              </div>
              <ul className="space-y-1.5">
                {s.opportunities.map((x, j) => <li key={j} className="text-gray-400 text-sm flex gap-2"><span className="text-blue-600 mt-0.5">→</span>{x}</li>)}
              </ul>
            </Card>
            <Card className="border-amber-900/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-amber-400 font-medium text-sm">Threats</span>
              </div>
              <ul className="space-y-1.5">
                {s.threats.map((x, j) => <li key={j} className="text-gray-400 text-sm flex gap-2"><span className="text-amber-600 mt-0.5">!</span>{x}</li>)}
              </ul>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecommendationsPanel({ report }: { report: CompetitorReport }) {
  const recs = report.recommendations;
  const sections = [
    { title: "How to Beat Competitors", icon: "🏆", items: recs.howToBeatCompetitors, color: "indigo" },
    { title: "Quick Wins", icon: "⚡", items: recs.quickWins, color: "emerald" },
    { title: "Ad Ideas", icon: "📢", items: recs.adIdeas, color: "purple" },
    { title: "Landing Page Ideas", icon: "🌐", items: recs.landingPageIdeas, color: "blue" },
    { title: "Offer Ideas", icon: "🏷️", items: recs.offerIdeas, color: "orange" },
    { title: "Content Ideas", icon: "✍️", items: recs.contentIdeas, color: "pink" },
    { title: "Growth Opportunities", icon: "📈", items: recs.growthOpportunities, color: "cyan" },
    { title: "Email Ideas", icon: "📧", items: recs.emailIdeas, color: "rose" },
  ];

  const colorMap: Record<string, string> = {
    indigo: "border-l-indigo-500",
    emerald: "border-l-emerald-500",
    purple: "border-l-purple-500",
    blue: "border-l-blue-500",
    orange: "border-l-orange-500",
    pink: "border-l-pink-500",
    cyan: "border-l-cyan-500",
    rose: "border-l-rose-500",
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        section.items.length > 0 && (
          <div key={section.title}>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span>{section.icon}</span> {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <div key={i} className={`pl-4 py-3 bg-gray-900/40 rounded-r-lg border-l-2 ${colorMap[section.color]} text-gray-300 text-sm`}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ResultTabs({ report }: Props) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 pb-2 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-96">
        {activeTab === "overview" && <OverviewPanel report={report} />}
        {activeTab === "competitors" && <CompetitorsPanel report={report} />}
        {activeTab === "ads" && <AdsPanel report={report} />}
        {activeTab === "hooks" && <HooksPanel hooks={report.hooks} />}
        {activeTab === "offers" && <OffersPanel offers={report.offers} />}
        {activeTab === "creatives" && <CreativesPanel report={report} />}
        {activeTab === "patterns" && <PatternsPanel report={report} />}
        {activeTab === "swot" && <SWOTPanel swot={report.swot} />}
        {activeTab === "recommendations" && <RecommendationsPanel report={report} />}
        {activeTab === "export" && <ExportButtons report={report} />}
      </div>
    </div>
  );
}
