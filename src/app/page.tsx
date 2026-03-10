import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "TaskFlow — Task Management Dashboard",
  description:
    "A professional task management dashboard. Manage, track, and organize your tasks.",
};

export default function HomePage() {
  return (
    <div className="w-full min-w-0 bg-background">
      {/* Ambient background glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-150 h-150 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-100 h-100 bg-purple-600/4 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-125 h-100 bg-cyan-600/3 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 w-full min-w-0">
        <AppHeader />
        <main className="w-full min-w-0 max-w-7xl mx-auto px-6 py-6">
          <DashboardClient />
        </main>
      </div>
    </div>
  );
}
