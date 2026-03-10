"use client";

import { useState } from "react";
import { StatsCards } from "./stats-cards";
import { TaskTable } from "./task-table";
import { KanbanBoard } from "./kanban-board";
import { TaskTableSkeleton } from "./task-table-skeleton";
import { CreateTaskDialog } from "./create-task-dialog";
import { Button } from "@/components/ui/button";
import { useTasks, useUsers } from "@/hooks/use-tasks";
import {
  Plus,
  LayoutList,
  Columns3,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

type ViewMode = "table" | "kanban";

export function DashboardClient() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [createOpen, setCreateOpen] = useState(false);

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
    refetch,
    isFetching,
  } = useTasks();

  const { data: users = [], isLoading: usersLoading } = useUsers();

  const isLoading = tasksLoading || usersLoading;

  return (
    <div className="w-full space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold bg-linear-to-r from-text-primary via-slate-200 to-text-secondary bg-clip-text text-transparent">
              Task Board
            </h2>
            {tasks && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 tabular-nums">
                {tasks.length} tasks
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted mt-1">
            Manage, track, and organize your tasks across all projects
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Refresh */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh data"
            className="h-9 w-9 shrink-0"
          >
            <RefreshCw
              className={`w-4 h-4 transition-transform duration-500 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5 gap-0.5">
            {(["table", "kanban"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-md transition-all duration-150 capitalize ${
                  viewMode === mode
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                    : "text-text-muted hover:text-text-secondary hover:bg-surface-elevated"
                }`}
              >
                {mode === "table" ? (
                  <LayoutList className="w-3.5 h-3.5" />
                ) : (
                  <Columns3 className="w-3.5 h-3.5" />
                )}
                {mode === "table" ? "Table" : "Kanban"}
              </button>
            ))}
          </div>

          {/* Create button */}
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/20 transition-all duration-150"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards tasks={tasks} isLoading={isLoading} />

      {/* Error state */}
      {tasksError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-red-500/10 shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text-primary">
              Failed to load tasks
            </h3>
            <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">
              There was an error fetching tasks from the API. Please check your
              connection and try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
              onClick={() => refetch()}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Main content */}
      {!tasksError && (
        <>
          {viewMode === "table" ? (
            isLoading ? (
              <TaskTableSkeleton />
            ) : (
              <TaskTable
                tasks={tasks ?? []}
                users={users}
                isLoading={isLoading}
              />
            )
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-10 rounded-xl bg-surface border border-border animate-pulse" />
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-28 rounded-xl bg-surface border border-border animate-pulse"
                      style={{ animationDelay: `${j * 100}ms` }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <KanbanBoard tasks={tasks ?? []} users={users} />
          )}
        </>
      )}

      {/* Create dialog */}
      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        users={users}
      />
    </div>
  );
}
