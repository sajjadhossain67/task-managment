import { CheckSquare, Zap, Database } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-[#2a3347]/80 bg-[#0f1117]/90 backdrop-blur-xl sticky top-0 z-40 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center shadow-lg shadow-blue-500/40">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[#0f1117] flex items-center justify-center">
                <Zap className="w-1.5 h-1.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-[#f1f5f9] to-[#94a3b8] bg-clip-text text-transparent leading-none">
                TaskFlow
              </h1>
              <p className="text-[10px] text-[#4a5568] mt-0.5 font-medium uppercase tracking-widest">
                Dashboard
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* API indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1e2533] border border-[#2a3347]">
              <Database className="w-3 h-3 text-[#60a5fa]" />
              <span className="text-[10px] text-[#64748b] font-medium">
                JSONPlaceholder
              </span>
            </div>

            {/* Live status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#052e16] border border-[#22c55e]/25">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22c55e]" />
              </span>
              <span className="text-xs text-[#4ade80] font-medium hidden sm:block">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
