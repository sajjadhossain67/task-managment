import { useMemo } from "react";
import type { Task } from "@/lib/types";

export interface TaskStats {
  total: number;
  done: number;
  inProgress: number;
  todo: number;
  high: number;
  uniqueUsers: number;
  completionRate: number;
}

export function useTaskStats(tasks: Task[] | undefined): TaskStats | null {
  return useMemo(() => {
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
}
