"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import type { Task } from "@/lib/types";
import { useTaskStats } from "@/hooks/use-task-stats";
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
  const stats = useTaskStats(tasks);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-20 rounded-xl" />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Tasks",
      value: stats?.total ?? 0,
      icon: ListTodo,
      color: "text-blue-400",
      iconBg: "bg-blue-500/15",
      borderColor: "border-blue-500/40",
      topBar: "bg-blue-500",
      glow: "hover:shadow-blue-500/10",
    },
    {
      label: "Completed",
      value: stats?.done ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-400",
      iconBg: "bg-emerald-500/15",
      borderColor: "border-emerald-500/40",
      topBar: "bg-emerald-500",
      glow: "hover:shadow-emerald-500/10",
    },
    {
      label: "In Progress",
      value: stats?.inProgress ?? 0,
      icon: Clock,
      color: "text-amber-400",
      iconBg: "bg-amber-500/15",
      borderColor: "border-amber-500/40",
      topBar: "bg-amber-500",
      glow: "hover:shadow-amber-500/10",
    },
    {
      label: "To Do",
      value: stats?.todo ?? 0,
      icon: ListTodo,
      color: "text-slate-400",
      iconBg: "bg-slate-500/15",
      borderColor: "border-slate-500/40",
      topBar: "bg-slate-500",
      glow: "hover:shadow-slate-500/10",
    },
    {
      label: "High Priority",
      value: stats?.high ?? 0,
      icon: AlertTriangle,
      color: "text-red-400",
      iconBg: "bg-red-500/15",
      borderColor: "border-red-500/40",
      topBar: "bg-red-500",
      glow: "hover:shadow-red-500/10",
    },
    {
      label: "Assignees",
      value: stats?.uniqueUsers ?? 0,
      icon: Users,
      color: "text-cyan-400",
      iconBg: "bg-cyan-500/15",
      borderColor: "border-cyan-500/40",
      topBar: "bg-cyan-500",
      glow: "hover:shadow-cyan-500/10",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`group relative rounded-xl border ${card.borderColor} bg-surface hover:bg-surface-elevated transition-all duration-200 cursor-default overflow-hidden hover:shadow-lg ${card.glow}`}
          >
            {/* Colored top accent bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-0.5 ${card.topBar} opacity-60 group-hover:opacity-100 transition-opacity duration-200`}
            />

            <div className="p-4 pt-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest truncate leading-none mb-2">
                    {card.label}
                  </p>
                  <p
                    className={`text-2xl font-bold leading-none tabular-nums ${card.color}`}
                  >
                    {card.value}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-lg ${card.iconBg} shrink-0 group-hover:scale-110 transition-transform duration-200`}
                >
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion progress bar */}
      {stats && (
        <div className="rounded-xl border border-white/8 bg-surface p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-indigo-500/15">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span className="text-sm font-semibold text-text-secondary">
                Overall Completion
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-muted-foreground tabular-nums">
                {stats.done}/{stats.total} tasks
              </span>
              <span className="text-sm font-bold text-indigo-400 tabular-nums bg-indigo-500/10 px-2 py-0.5 rounded-md">
                {stats.completionRate}%
              </span>
            </div>
          </div>
          <Progress
            value={stats.completionRate}
            className="h-1.5 bg-white/6 [&>div]:bg-linear-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500"
          />
          <p className="text-xs text-muted-foreground mt-2.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="text-amber-400 font-medium">
                {stats.inProgress}
              </span>
              <span>in progress</span>
            </span>
            <span className="text-white/20">·</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
              <span className="text-slate-400 font-medium">{stats.todo}</span>
              <span>remaining</span>
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
