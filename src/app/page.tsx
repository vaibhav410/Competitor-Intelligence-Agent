import SearchBox from "@/components/SearchBox";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">CS</span>
          </div>
          <span className="text-white font-semibold tracking-tight">
            Creative Strategist
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 px-2 py-1 rounded-full border border-gray-800">
            Competitor Intelligence Agent
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-800/50 bg-indigo-900/20 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-indigo-400 text-xs font-medium">
            AI-Powered Competitor Research
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-center mb-6">
          <span className="block text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-2">
            Outsmart Your
          </span>
          <span className="block text-5xl md:text-7xl font-black tracking-tight leading-none bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Competition
          </span>
        </h1>

        <p className="text-gray-500 text-lg md:text-xl text-center max-w-xl mb-12 leading-relaxed">
          Enter any brand, website, product, or niche. Get a complete competitor
          intelligence report — ads, hooks, offers, patterns & strategy.
        </p>

        {/* Search Box */}
        <SearchBox />

        {/* Feature Pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          {[
            { icon: "🌐", text: "Website Analysis" },
            { icon: "📢", text: "Ad Intelligence" },
            { icon: "🎣", text: "Hook Extraction" },
            { icon: "🏷️", text: "Offer Analysis" },
            { icon: "🔮", text: "Winning Patterns" },
            { icon: "⚔️", text: "SWOT Analysis" },
            { icon: "💡", text: "Recommendations" },
            { icon: "📥", text: "PDF / CSV Export" },
          ].map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/60 border border-gray-800/50 text-gray-500 text-sm"
            >
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 py-4 px-6 text-center">
        <p className="text-gray-700 text-xs">
          Creative Strategist · Competitor Intelligence Agent · Powered by
          Claude AI & Apify
        </p>
      </footer>
    </main>
  );
}
