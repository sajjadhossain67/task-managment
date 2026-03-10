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
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f1f5f9] via-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent">
              Task Board
            </h2>
            {tasks && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#3b82f6]/15 text-[#60a5fa] border border-[#3b82f6]/25">
                {tasks.length} tasks
              </span>
            )}
          </div>
          <p className="text-sm text-[#64748b] mt-1">
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
            className="h-9 w-9"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-[#2a3347] bg-[#0f1117] p-0.5 gap-0.5">
            <button
              className={`flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-md transition-all duration-150 ${
                viewMode === "table"
                  ? "bg-[#3b82f6] text-white shadow-sm"
                  : "text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1e2533]"
              }`}
              onClick={() => setViewMode("table")}
            >
              <LayoutList className="w-3.5 h-3.5" />
              Table
            </button>
            <button
              className={`flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-md transition-all duration-150 ${
                viewMode === "kanban"
                  ? "bg-[#3b82f6] text-white shadow-sm"
                  : "text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1e2533]"
              }`}
              onClick={() => setViewMode("kanban")}
            >
              <Columns3 className="w-3.5 h-3.5" />
              Kanban
            </button>
          </div>

          {/* Create button */}
          <Button
            onClick={() => setCreateOpen(true)}
            className="shadow-lg shadow-blue-500/20 font-semibold"
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
        <div className="rounded-xl border border-[#ef4444]/30 bg-[#2d0a0a] p-6 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-[#ef4444]/10">
            <AlertTriangle className="w-5 h-5 text-[#f87171]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#f1f5f9]">
              Failed to load tasks
            </h3>
            <p className="text-sm text-[#94a3b8] mt-1">
              There was an error fetching tasks from the API. Please check your
              connection and try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-[#ef4444]/30 text-[#f87171] hover:bg-[#ef4444]/10"
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
                  <div className="h-10 rounded-xl bg-[#161b27] border border-[#2a3347] animate-pulse" />
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-28 rounded-xl bg-[#161b27] border border-[#2a3347] animate-pulse"
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
