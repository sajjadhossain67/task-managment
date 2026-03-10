import { CheckSquare, Zap } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-[#2a3347] bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-[#3b82f6] flex items-center justify-center shadow-lg shadow-blue-500/30">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[#0f1117] flex items-center justify-center">
                <Zap className="w-1.5 h-1.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#f1f5f9] leading-none">
                TaskFlow
              </h1>
              <p className="text-[10px] text-[#4a5568] mt-0.5 font-medium uppercase tracking-widest">
                Dashboard
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#052e16] border border-[#22c55e]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs text-[#4ade80] font-medium hidden sm:block">
              Live
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
