"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CompetitorReport, StreamEvent } from "@/lib/types";
import ProgressTimeline from "@/components/ProgressTimeline";
import ResultTabs from "@/components/ResultTabs";
import Link from "next/link";

type Phase = "idle" | "analyzing" | "done" | "error";

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [phase, setPhase] = useState<Phase>("idle");
  const [logs, setLogs] = useState<StreamEvent[]>([]);
  const [currentStep, setCurrentStep] = useState("");
  const [stepNumber, setStepNumber] = useState(0);
  const [totalSteps, setTotalSteps] = useState(10);
  const [report, setReport] = useState<CompetitorReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasStarted = useRef(false);

  useEffect(() => {
    if (!query || hasStarted.current) return;
    hasStarted.current = true;
    runAnalysis(query);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const runAnalysis = async (input: string) => {
    setPhase("analyzing");
    setLogs([]);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event: StreamEvent = JSON.parse(line.slice(6));

            if (event.type === "log") {
              setLogs((prev) => [...prev, event]);
            } else if (event.type === "progress") {
              setCurrentStep(event.step || "");
              setStepNumber(event.stepNumber || 0);
              setTotalSteps(event.totalSteps || 10);
              setLogs((prev) => [...prev, event]);
            } else if (event.type === "result") {
              setReport(event.data as CompetitorReport);
            } else if (event.type === "done") {
              setPhase("done");
            } else if (event.type === "error") {
              setError(event.message || "Analysis failed");
              setPhase("error");
            }
          } catch {
            // Skip malformed events
          }
        }
      }

      if (phase !== "done") setPhase("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(msg);
      setPhase("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800/50 bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">CS</span>
          </div>
          <span className="text-white font-semibold tracking-tight">Creative Strategist</span>
        </Link>

        <div className="flex items-center gap-3">
          {phase === "done" && report && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Analysis Complete
            </div>
          )}
          {phase === "analyzing" && (
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Analyzing...
            </div>
          )}
          <Link
            href="/"
            className="text-gray-500 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800"
          >
            ← New Search
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex-1 px-4 md:px-6 py-8 max-w-5xl mx-auto w-full">
        {/* Query Display */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
            <span>Analyzing</span>
            <span className="text-gray-400 font-medium bg-gray-900/60 px-2 py-0.5 rounded border border-gray-800">
              {query}
            </span>
          </div>

          {phase === "analyzing" && (
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Running Competitor Intelligence Analysis...
            </h1>
          )}
          {phase === "done" && report && (
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Competitor Intelligence Report
            </h1>
          )}
          {phase === "error" && (
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Analysis Failed
            </h1>
          )}
        </div>

        {/* Analyzing Phase */}
        {phase === "analyzing" && (
          <div className="flex flex-col items-center py-12">
            {/* Animated orb */}
            <div className="relative mb-12">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/50 to-purple-500/50 flex items-center justify-center animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 animate-spin" />
                </div>
              </div>
              {/* Orbit rings */}
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping" />
              <div className="absolute -inset-4 rounded-full border border-purple-500/10 animate-pulse" />
            </div>

            <ProgressTimeline
              logs={logs}
              currentStep={currentStep}
              stepNumber={stepNumber}
              totalSteps={totalSteps}
            />
          </div>
        )}

        {/* Error Phase */}
        {phase === "error" && (
          <div className="flex flex-col items-center py-20">
            <div className="text-6xl mb-6">❌</div>
            <h2 className="text-white text-xl font-semibold mb-2">Analysis Failed</h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Done Phase */}
        {phase === "done" && report && (
          <div className="space-y-6">
            {/* Quick stats bar */}
            <div className="flex flex-wrap gap-3 p-4 bg-gray-900/40 border border-gray-800/50 rounded-xl">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-gray-500">{report.competitors.length} competitors</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-gray-500">{report.ads.length} ads analyzed</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-gray-500">{report.hooks.length} hooks extracted</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-gray-500">{report.offers.length} offers found</span>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-sm">
                <span className="text-gray-600">Confidence:</span>
                <span className="text-indigo-400 font-medium">{report.winningPatterns.overallConfidence}%</span>
              </div>
            </div>

            <ResultTabs report={report} />
          </div>
        )}
      </div>
    </main>
  );
}
