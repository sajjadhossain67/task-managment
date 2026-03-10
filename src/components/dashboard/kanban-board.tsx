"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EditTaskDialog } from "./edit-task-dialog";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { useUpdateTask } from "@/hooks/use-tasks";
import type { Task, User } from "@/lib/types";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  ListTodo,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanBoardProps {
  tasks: Task[];
  users: User[];
}

const COLUMNS: {
  key: Task["status"];
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    key: "todo",
    label: "To Do",
    icon: ListTodo,
    color: "text-[#94a3b8]",
    bgColor: "bg-[#6b7a9a]/10",
    borderColor: "border-[#6b7a9a]/30",
  },
  {
    key: "in-progress",
    label: "In Progress",
    icon: Clock,
    color: "text-[#60a5fa]",
    bgColor: "bg-[#3b82f6]/10",
    borderColor: "border-[#3b82f6]/30",
  },
  {
    key: "done",
    label: "Done",
    icon: CheckCircle2,
    color: "text-[#4ade80]",
    bgColor: "bg-[#22c55e]/10",
    borderColor: "border-[#22c55e]/30",
  },
];

const PRIORITY_COLORS: Record<Task["priority"], string> = {
  low: "border-l-[#6b7a9a]",
  medium: "border-l-[#f59e0b]",
  high: "border-l-[#ef4444]",
};

function TaskCard({
  task,
  users,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  task: Task;
  users: User[];
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
  onStatusChange: (t: Task, status: Task["status"]) => void;
}) {
  const user = users.find((u) => u.id === task.userId);
  const colors = [
    "bg-[#3b82f6]",
    "bg-[#8b5cf6]",
    "bg-[#ec4899]",
    "bg-[#22c55e]",
    "bg-[#f59e0b]",
    "bg-[#06b6d4]",
    "bg-[#ef4444]",
    "bg-[#84cc16]",
    "bg-[#a855f7]",
    "bg-[#f97316]",
  ];
  const colorClass = colors[(task.userId - 1) % colors.length];
  const initials =
    user?.name
      ?.split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "?";

  const PRIORITY_BADGE: Record<Task["priority"], "low" | "medium" | "high"> = {
    low: "low",
    medium: "medium",
    high: "high",
  };

  return (
    <Card
      className={`border-l-4 ${PRIORITY_COLORS[task.priority]} border-border bg-charcoal hover:bg-surface-elevated hover:border-border-light cursor-default transition-all duration-150 group shadow-sm hover:shadow-md hover:shadow-black/20`}
    >
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-[#e2e8f0] line-clamp-2 flex-1 leading-snug">
            {task.title}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="w-3.5 h-3.5 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {task.status !== "todo" && (
                <DropdownMenuItem onClick={() => onStatusChange(task, "todo")}>
                  <ListTodo className="w-3.5 h-3.5 mr-2" />
                  Move to To Do
                </DropdownMenuItem>
              )}
              {task.status !== "in-progress" && (
                <DropdownMenuItem
                  onClick={() => onStatusChange(task, "in-progress")}
                >
                  <Clock className="w-3.5 h-3.5 mr-2" />
                  Move to In Progress
                </DropdownMenuItem>
              )}
              {task.status !== "done" && (
                <DropdownMenuItem onClick={() => onStatusChange(task, "done")}>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                  Mark as Done
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-[#f87171] focus:text-[#f87171] focus:bg-danger/10"
                onClick={() => onDelete(task)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-text-muted mt-1 line-clamp-2">{task.body}</p>

        <div className="flex items-center justify-between mt-3">
          <Badge
            variant={PRIORITY_BADGE[task.priority]}
            className="text-[10px]"
          >
            {task.priority}
          </Badge>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#4a5568]">#{task.id}</span>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${colorClass}`}
            >
              {initials}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KanbanBoard({ tasks, users }: KanbanBoardProps) {
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const { mutate: updateTask } = useUpdateTask();

  const handleStatusChange = (task: Task, status: Task["status"]) => {
    updateTask({ id: task.id, status });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="flex flex-col gap-3">
              {/* Column header */}
              <div
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${col.borderColor} ${col.bgColor}`}
              >
                <div className="flex items-center gap-2">
                  <col.icon className={`w-4 h-4 ${col.color}`} />
                  <span className={`text-sm font-semibold ${col.color}`}>
                    {col.label}
                  </span>
                </div>
                <span
                  className={`text-xs font-bold min-w-6 text-center px-2 py-0.5 rounded-full ${col.bgColor} ${col.color} border ${col.borderColor}`}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 min-h-50">
                {colTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-24 rounded-xl border border-dashed border-border gap-2">
                    <col.icon className={`w-5 h-5 ${col.color} opacity-30`} />
                    <p className="text-[#4a5568] text-xs">No tasks here</p>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      users={users}
                      onEdit={setEditTask}
                      onDelete={setDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <EditTaskDialog
        open={!!editTask}
        onOpenChange={(open) => !open && setEditTask(null)}
        task={editTask}
        users={users}
      />
      <DeleteTaskDialog
        open={!!deleteTask}
        onOpenChange={(open) => !open && setDeleteTask(null)}
        task={deleteTask}
      />
    </>
  );
}
