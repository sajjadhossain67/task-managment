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
    <div className="min-h-screen bg-[#0f1117]">
      <AppHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardClient />
      </main>
    </div>
  );
}
