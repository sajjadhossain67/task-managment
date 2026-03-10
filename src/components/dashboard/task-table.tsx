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
    <ArrowUp className="w-3 h-3 text-blue-400" />
  ) : (
    <ArrowDown className="w-3 h-3 text-blue-400" />
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
    low: { label: "Low", variant: "low", dot: "bg-slate-400" },
    medium: { label: "Medium", variant: "medium", dot: "bg-amber-400" },
    high: { label: "High", variant: "high", dot: "bg-red-400" },
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
    "bg-blue-500 text-white",
    "bg-purple-500 text-white",
    "bg-pink-500 text-white",
    "bg-green-500 text-white",
    "bg-orange-500 text-white",
    "bg-cyan-500 text-white",
  ];

  const colorClass = colors[(userId - 1) % colors.length];

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${colorClass}`}
      >
        {initials}
      </div>

      <span className="text-xs text-muted-foreground truncate hidden sm:block">
        {user?.name?.split(" ")[0] ?? `User ${userId}`}
      </span>
    </div>
  );
}

export function TaskTable({ tasks, users }: TaskTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

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
      let aVal: any = a[sortField] ?? "";
      let bVal: any = b[sortField] ?? "";

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

  const ColHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition"
    >
      {children}
      <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
    </button>
  );

  return (
    <>
      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>

          <Select
            value={filterStatus}
            onValueChange={(v) => {
              setFilterStatus(v as FilterStatus);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterPriority}
            onValueChange={(v) => {
              setFilterPriority(v as FilterPriority);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs text-muted-foreground">
          {filtered.length} task{filtered.length !== 1 && "s"}
        </span>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-[#2a3347] bg-[#161b27] overflow-hidden isolate">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-[#161b27] border-b border-[#2a3347]">
              <tr>
                <th className="px-4 py-3 text-left w-16 text-xs text-muted-foreground">
                  #
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

                <th className="px-4 py-3 text-right w-24 text-xs text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No tasks found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-[#2a3347] last:border-0 hover:bg-muted/40 transition"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      #{task.id}
                    </td>

                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm font-medium truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {task.body}
                      </p>
                    </td>

                    <td className="px-4 py-3 hidden md:table-cell">
                      <StatusBadge status={task.status} />
                    </td>

                    <td className="px-4 py-3 hidden md:table-cell">
                      <PriorityBadge priority={task.priority} />
                    </td>

                    <td className="px-4 py-3 hidden lg:table-cell">
                      <UserAvatar userId={task.userId} users={users} />
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => setEditTask(task)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-400 hover:text-red-500"
                          onClick={() => setDeleteTask(task)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a3347] bg-[#161b27]">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <EditTaskDialog
        open={!!editTask}
        onOpenChange={() => setEditTask(null)}
        task={editTask}
        users={users}
      />

      <DeleteTaskDialog
        open={!!deleteTask}
        onOpenChange={() => setDeleteTask(null)}
        task={deleteTask}
      />
    </>
  );
}
