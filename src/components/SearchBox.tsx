"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLES = [
  { label: "Website", value: "nike.com" },
  { label: "Brand", value: "Apple" },
  { label: "Product", value: "Protein Powder" },
  { label: "Niche", value: "Dentists in London" },
  { label: "Agency", value: "Digital Marketing Agency" },
  { label: "SaaS", value: "Project Management SaaS" },
];

export default function SearchBox() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    router.push(`/results?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl opacity-20 group-focus-within:opacity-60 blur transition-all duration-500" />

          <div className="relative flex items-center bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
            {/* Search Icon */}
            <div className="pl-5 pr-2 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter brand, website, product, or niche..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-lg py-5 px-3 outline-none"
              autoFocus
            />

            <button
              type="submit"
              disabled={!value.trim() || loading}
              className="m-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Examples */}
      <div className="mt-5 flex flex-wrap gap-2 justify-center">
        <span className="text-gray-600 text-sm self-center">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.value}
            onClick={() => setValue(ex.value)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 hover:border-indigo-500/50 text-sm text-gray-400 hover:text-white transition-all duration-200"
          >
            <span className="text-indigo-500 text-xs font-medium">{ex.label}</span>
            <span>{ex.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
