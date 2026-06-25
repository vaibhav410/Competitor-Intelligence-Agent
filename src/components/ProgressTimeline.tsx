"use client";

import { StreamEvent } from "@/lib/types";
import { useEffect, useRef } from "react";

interface Props {
  logs: StreamEvent[];
  currentStep: string;
  stepNumber: number;
  totalSteps: number;
}

const STEP_ICONS: Record<string, string> = {
  "Validating input": "🔍",
  "Discovering competitors": "🏢",
  "Researching websites & ads": "🌐",
  "Analyzing hooks, offers & creatives": "🎯",
  "Detecting winning patterns": "📊",
  "Running SWOT analysis": "⚔️",
  "Generating recommendations": "💡",
  "Generating report": "📝",
  "Finalizing report": "✅",
  "Complete": "🎉",
};

const LEVEL_STYLES: Record<string, string> = {
  info: "text-gray-400",
  success: "text-emerald-400",
  warning: "text-amber-400",
  error: "text-red-400",
};

const LEVEL_DOT: Record<string, string> = {
  info: "bg-gray-600",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
};

export default function ProgressTimeline({ logs, currentStep, stepNumber, totalSteps }: Props) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const progress = totalSteps > 0 ? (stepNumber / totalSteps) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{STEP_ICONS[currentStep] || "⚡"}</span>
            <span className="text-white font-medium">{currentStep || "Initializing..."}</span>
          </div>
          <span className="text-gray-500 text-sm">{stepNumber}/{totalSteps}</span>
        </div>

        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Live Logs */}
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-800/50 bg-gray-900/80">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-amber-500/70" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <span className="ml-2 text-gray-600 text-xs font-mono">agent.log</span>
        </div>

        {/* Log entries */}
        <div className="p-4 h-64 overflow-y-auto font-mono text-sm space-y-1.5 scroll-smooth">
          {logs.filter((e) => e.type === "log").map((event, i) => (
            <div key={i} className="flex items-start gap-2 animate-fadeIn">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${LEVEL_DOT[event.level || "info"]}`} />
              <span className="text-gray-600 text-xs select-none flex-shrink-0">
                {String(i + 1).padStart(3, "0")}
              </span>
              <span className={LEVEL_STYLES[event.level || "info"]}>
                {event.message}
              </span>
            </div>
          ))}

          {/* Cursor blink */}
          <div className="flex items-center gap-2 text-indigo-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs animate-pulse">processing...</span>
          </div>

          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Step Dots */}
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: totalSteps || 10 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < stepNumber
                ? "w-6 h-1.5 bg-indigo-500"
                : i === stepNumber - 1
                ? "w-4 h-1.5 bg-purple-500 animate-pulse"
                : "w-1.5 h-1.5 bg-gray-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
