"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditTaskDialog } from "./edit-task-dialog";
import { DeleteTaskDialog } from "./delete-task-dialog";
import type {
  Task,
  User,
  SortField,
  SortDirection,
  FilterStatus,
  FilterPriority,
} from "@/lib/types";
import {
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

interface TaskTableProps {
  tasks: Task[];
  users: User[];
  isLoading: boolean;
}

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField;
  sortField: SortField;
  sortDir: SortDirection;
}) {
  if (sortField !== field)
    return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  return sortDir === "asc" ? (
    <ArrowUp className="w-3 h-3 text-electric-blue" />
  ) : (
    <ArrowDown className="w-3 h-3 text-electric-blue" />
  );
}

function StatusBadge({ status }: { status: Task["status"] }) {
  const map: Record<
    Task["status"],
    { label: string; variant: "todo" | "in-progress" | "done" }
  > = {
    todo: { label: "To Do", variant: "todo" },
    "in-progress": { label: "In Progress", variant: "in-progress" },
    done: { label: "Done", variant: "done" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const map: Record<
    Task["priority"],
    { label: string; variant: "low" | "medium" | "high"; dot: string }
  > = {
    low: { label: "Low", variant: "low", dot: "bg-[#94a3b8]" },
    medium: { label: "Medium", variant: "medium", dot: "bg-[#fbbf24]" },
    high: { label: "High", variant: "high", dot: "bg-[#f87171]" },
  };
  const { label, variant, dot } = map[priority];
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </Badge>
  );
}

function UserAvatar({ userId, users }: { userId: number; users: User[] }) {
  const user = users.find((u) => u.id === userId);
  const initials =
    user?.name
      ?.split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "?";

  const colors = [
    "bg-[#3b82f6] text-white",
    "bg-[#8b5cf6] text-white",
    "bg-[#ec4899] text-white",
    "bg-[#22c55e] text-white",
    "bg-[#f59e0b] text-white",
    "bg-[#06b6d4] text-white",
    "bg-[#ef4444] text-white",
    "bg-[#84cc16] text-white",
    "bg-[#a855f7] text-white",
    "bg-[#f97316] text-white",
  ];

  const colorClass = colors[(userId - 1) % colors.length];

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${colorClass}`}
      >
        {initials}
      </div>
      <span className="text-xs text-text-secondary truncate hidden sm:block">
        {user?.name?.split(" ")[0] ?? `User ${userId}`}
      </span>
    </div>
  );
}

export function TaskTable({ tasks, users, isLoading }: TaskTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  // Filter + sort
  const filtered = useMemo(() => {
    let result = tasks;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.body.toLowerCase().includes(q) ||
          String(t.id).includes(q),
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((t) => t.status === filterStatus);
    }

    if (filterPriority !== "all") {
      result = result.filter((t) => t.priority === filterPriority);
    }

    result = [...result].sort((a, b) => {
      let aVal: string | number = a[sortField] ?? "";
      let bVal: string | number = b[sortField] ?? "";

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [tasks, search, filterStatus, filterPriority, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const handleFilterStatus = (v: string) => {
    setFilterStatus(v as FilterStatus);
    setPage(1);
  };

  const handleFilterPriority = (v: string) => {
    setFilterPriority(v as FilterPriority);
    setPage(1);
  };

  const handlePageSize = (v: string) => {
    setPageSize(Number(v));
    setPage(1);
  };

  const ColHeader = ({
    field,
    children,
    className = "",
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 text-xs font-semibold text-text-muted uppercase tracking-wider hover:text-text-secondary transition-colors ${className}`}
    >
      {children}
      <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
    </button>
  );

  return (
    <>
      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568]" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={handleFilterStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">📋 To Do</SelectItem>
            <SelectItem value="in-progress">⚡ In Progress</SelectItem>
            <SelectItem value="done">✅ Done</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={handleFilterPriority}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">🟢 Low</SelectItem>
            <SelectItem value="medium">🟡 Medium</SelectItem>
            <SelectItem value="high">🔴 High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table container */}
      <div className="rounded-xl border border-[#2a3347] bg-[#161b27] overflow-hidden">
        {/* Desktop table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a3347]">
                <th className="px-4 py-3 text-left w-16">
                  <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    #
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <ColHeader field="title">Title</ColHeader>
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  <ColHeader field="status">Status</ColHeader>
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  <ColHeader field="priority">Priority</ColHeader>
                </th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">
                  <ColHeader field="userId">Assignee</ColHeader>
                </th>
                <th className="px-4 py-3 text-left hidden xl:table-cell">
                  <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    Created
                  </span>
                </th>
                <th className="px-4 py-3 text-right">
                  <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-2xl bg-[#161b27] border border-[#2a3347]">
                        <AlertCircle className="w-8 h-8 text-[#374159]" />
                      </div>
                      <div>
                        <p className="text-[#64748b] text-sm font-medium">
                          {search ||
                          filterStatus !== "all" ||
                          filterPriority !== "all"
                            ? "No tasks match your filters"
                            : "No tasks found"}
                        </p>
                        {(search ||
                          filterStatus !== "all" ||
                          filterPriority !== "all") && (
                          <p className="text-[#4a5568] text-xs mt-1">
                            Try adjusting your search or filters
                          </p>
                        )}
                      </div>
                      {(search ||
                        filterStatus !== "all" ||
                        filterPriority !== "all") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#60a5fa] hover:text-[#93c5fd] hover:bg-[#3b82f6]/10"
                          onClick={() => {
                            setSearch("");
                            setFilterStatus("all");
                            setFilterPriority("all");
                          }}
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-[#1a1f2e] last:border-0 hover:bg-[#1e2533]/60 transition-colors duration-100 group"
                  >
                    {/* ID */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-[#4a5568] bg-[#0f1117] px-2 py-1 rounded">
                        #{task.id}
                      </span>
                    </td>

                    {/* Title + body */}
                    <td className="px-4 py-3.5 max-w-[300px]">
                      <div>
                        <p className="text-sm font-medium text-[#f1f5f9] line-clamp-1">
                          {task.title}
                        </p>
                        <p className="text-xs text-[#64748b] line-clamp-1 mt-0.5">
                          {task.body}
                        </p>
                        {/* Mobile badges */}
                        <div className="flex gap-1.5 mt-1.5 md:hidden">
                          <StatusBadge status={task.status} />
                          <PriorityBadge priority={task.priority} />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <StatusBadge status={task.status} />
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <PriorityBadge priority={task.priority} />
                    </td>

                    {/* Assignee */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <UserAvatar userId={task.userId} users={users} />
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      <span className="text-xs text-[#64748b]">
                        {format(new Date(task.createdAt), "MMM d, yyyy")}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#94a3b8] hover:text-[#fbbf24] hover:bg-[#f59e0b]/10"
                          onClick={() => setEditTask(task)}
                          title="Edit task"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#94a3b8] hover:text-[#f87171] hover:bg-[#ef4444]/10"
                          onClick={() => setDeleteTask(task)}
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-[#2a3347] bg-[#0f1117]/30">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#64748b]">
              Showing{" "}
              <span className="text-[#94a3b8] font-medium">
                {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="text-[#94a3b8] font-medium">
                {filtered.length}
              </span>{" "}
              tasks
            </span>
            <Select value={String(pageSize)} onValueChange={handlePageSize}>
              <SelectTrigger className="w-[70px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "ghost"}
                  size="icon"
                  className="h-7 w-7 text-xs"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <EditTaskDialog
        open={!!editTask}
        onOpenChange={(open) => !open && setEditTask(null)}
        task={editTask}
        users={users}
      />

      {/* Delete dialog */}
      <DeleteTaskDialog
        open={!!deleteTask}
        onOpenChange={(open) => !open && setDeleteTask(null)}
        task={deleteTask}
      />
    </>
  );
}
