import Image from "next/image";
import { Database } from "lucide-react";

export function AppHeader() {
  return (
    <header className="w-full border-b border-border/80 bg-background/90 backdrop-blur-xl sticky top-0 z-40 shadow-lg shadow-black/20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-blue-500/30">
                <Image
                  src="/logo.png"
                  alt="TaskFlow logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent leading-none">
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
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-elevated border border-border">
              <Database className="w-3 h-3 text-electric-blue-light" />
              <span className="text-[10px] text-text-muted font-medium">
                JSONPlaceholder
              </span>
            </div>

            {/* Live status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-bg border border-success/25">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
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
