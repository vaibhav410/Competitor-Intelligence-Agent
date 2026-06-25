"use client";

import { useState } from "react";
import { CompetitorReport } from "@/lib/types";

interface Props {
  report: CompetitorReport;
}

export default function ExportButtons({ report }: Props) {
  const [downloading, setDownloading] = useState<"pdf" | "csv" | "json" | null>(null);

  const downloadJSON = async () => {
    setDownloading("json");
    try {
      const res = await fetch("/api/export/json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `competitor-report-${report.input.value.replace(/\s+/g, "-").toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  };

  const downloadCSV = async () => {
    setDownloading("csv");
    try {
      const res = await fetch("/api/export/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `competitor-report-${report.input.value.replace(/\s+/g, "-").toLowerCase()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  };

  const downloadPDF = async () => {
    setDownloading("pdf");
    try {
      const res = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
      const html = await res.text();
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } finally {
      setDownloading(null);
    }
  };

  const buttons = [
    {
      key: "pdf" as const,
      label: "PDF Report",
      icon: "📄",
      description: "Professional formatted report",
      onClick: downloadPDF,
      gradient: "from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500",
    },
    {
      key: "csv" as const,
      label: "CSV Data",
      icon: "📊",
      description: "Spreadsheet with all data",
      onClick: downloadCSV,
      gradient: "from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500",
    },
    {
      key: "json" as const,
      label: "JSON Export",
      icon: "💾",
      description: "Complete structured data",
      onClick: downloadJSON,
      gradient: "from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white font-semibold text-lg mb-1">Export Report</h3>
        <p className="text-gray-500 text-sm">Download your competitor intelligence in multiple formats</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {buttons.map((btn) => (
          <button
            key={btn.key}
            onClick={btn.onClick}
            disabled={downloading !== null}
            className={`group relative flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br ${btn.gradient} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-lg`}
          >
            {downloading === btn.key && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <span className="text-3xl">{btn.icon}</span>
            <div className="text-center">
              <div className="text-white font-semibold">{btn.label}</div>
              <div className="text-white/70 text-xs mt-0.5">{btn.description}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center text-gray-600 text-xs">
        Reports are generated dynamically. No data is stored.
      </div>
    </div>
  );
}
