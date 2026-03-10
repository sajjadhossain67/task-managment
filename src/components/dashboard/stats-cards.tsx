"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import type { Task } from "@/lib/types";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  AlertTriangle,
  Users,
} from "lucide-react";

interface StatsCardsProps {
  tasks: Task[] | undefined;
  isLoading: boolean;
}

export function StatsCards({ tasks, isLoading }: StatsCardsProps) {
  const stats = useMemo(() => {
    if (!tasks) return null;
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const high = tasks.filter((t) => t.priority === "high").length;
    const uniqueUsers = new Set(tasks.map((t) => t.userId)).size;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, todo, high, uniqueUsers, completionRate };
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Tasks",
      value: stats?.total ?? 0,
      icon: ListTodo,
      color: "text-[#60a5fa]",
      bg: "bg-[#3b82f6]/10",
      border: "border-[#3b82f6]/20",
    },
    {
      label: "Completed",
      value: stats?.done ?? 0,
      icon: CheckCircle2,
      color: "text-[#4ade80]",
      bg: "bg-[#22c55e]/10",
      border: "border-[#22c55e]/20",
    },
    {
      label: "In Progress",
      value: stats?.inProgress ?? 0,
      icon: Clock,
      color: "text-[#60a5fa]",
      bg: "bg-[#3b82f6]/10",
      border: "border-[#3b82f6]/20",
    },
    {
      label: "To Do",
      value: stats?.todo ?? 0,
      icon: ListTodo,
      color: "text-[#94a3b8]",
      bg: "bg-[#6b7a9a]/10",
      border: "border-[#6b7a9a]/20",
    },
    {
      label: "High Priority",
      value: stats?.high ?? 0,
      icon: AlertTriangle,
      color: "text-[#f87171]",
      bg: "bg-[#ef4444]/10",
      border: "border-[#ef4444]/20",
    },
    {
      label: "Assignees",
      value: stats?.uniqueUsers ?? 0,
      icon: Users,
      color: "text-[#22d3ee]",
      bg: "bg-[#06b6d4]/10",
      border: "border-[#06b6d4]/20",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card) => (
          <Card
            key={card.label}
            className={`border ${card.border} bg-surface hover:bg-[#1a2030] transition-all duration-200 animate-fade-in group cursor-default`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] text-[#4a5568] font-semibold uppercase tracking-widest truncate">
                    {card.label}
                  </p>
                  <p
                    className={`text-[1.6rem] font-extrabold mt-1 leading-none ${card.color}`}
                  >
                    {card.value}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-lg ${card.bg} shrink-0 group-hover:scale-110 transition-transform duration-200`}
                >
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion progress bar */}
      {stats && (
        <div className="rounded-xl border border-border bg-surface p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-electric-blue-light" />
              <span className="text-sm font-semibold text-text-secondary">
                Overall Completion
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">
                {stats.done}/{stats.total}
              </span>
              <span className="text-sm font-bold text-electric-blue-light tabular-nums">
                {stats.completionRate}%
              </span>
            </div>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
          <p className="text-xs text-[#4a5568] mt-2">
            {stats.inProgress} in progress · {stats.todo} remaining
          </p>
        </div>
      )}
    </div>
  );
}
