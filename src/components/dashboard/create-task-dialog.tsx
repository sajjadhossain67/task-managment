"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTask } from "@/hooks/use-tasks";
import type { User } from "@/lib/types";
import { Loader2, Plus, Sparkles } from "lucide-react";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  body: z.string().min(5, "Description must be at least 5 characters").max(500),
  userId: z.number().min(1, "Please select an assignee"),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
});

type FormValues = z.infer<typeof schema>;

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[];
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  users,
}: CreateTaskDialogProps) {
  const { mutate: createTask, isPending } = useCreateTask();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "todo",
      priority: "medium",
      userId: 1,
    },
  });

  const onSubmit = (data: FormValues) => {
    createTask(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const charCount = watch("body")?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0 overflow-hidden">
        {/* Top accent stripe */}
        <div className="h-1 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6">
          <DialogHeader className="mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-200 dark:ring-indigo-500/20">
                <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">
                  Create New Task
                </DialogTitle>
                <DialogDescription className="text-xs mt-0.5">
                  Add a new task to your board. Fill in the details below.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Task Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Implement authentication flow..."
                className="h-9 text-sm focus-visible:ring-indigo-500/50"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="body"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Description <span className="text-destructive">*</span>
                </Label>
                <span
                  className={`text-xs tabular-nums ${charCount > 400 ? "text-amber-500" : "text-muted-foreground"}`}
                >
                  {charCount}/500
                </span>
              </div>
              <Textarea
                id="body"
                placeholder="Describe the task in detail..."
                rows={4}
                className="text-sm resize-none focus-visible:ring-indigo-500/50"
                {...register("body")}
              />
              {errors.body && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                  {errors.body.message}
                </p>
              )}
            </div>

            {/* Row: Status + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </Label>
                <Select
                  defaultValue="todo"
                  onValueChange={(v) =>
                    setValue("status", v as FormValues["status"])
                  }
                >
                  <SelectTrigger className="h-9 text-sm focus:ring-indigo-500/50">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        To Do
                      </span>
                    </SelectItem>
                    <SelectItem value="in-progress">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        In Progress
                      </span>
                    </SelectItem>
                    <SelectItem value="done">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Done
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-xs text-destructive">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Priority
                </Label>
                <Select
                  defaultValue="medium"
                  onValueChange={(v) =>
                    setValue("priority", v as FormValues["priority"])
                  }
                >
                  <SelectTrigger className="h-9 text-sm focus:ring-indigo-500/50">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Low
                      </span>
                    </SelectItem>
                    <SelectItem value="medium">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Medium
                      </span>
                    </SelectItem>
                    <SelectItem value="high">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        High
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Assignee <span className="text-destructive">*</span>
              </Label>
              <Select
                defaultValue="1"
                onValueChange={(v) => setValue("userId", Number(v))}
              >
                <SelectTrigger className="h-9 text-sm focus:ring-indigo-500/50">
                  <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.userId && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                  {errors.userId.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-3 border-t gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  reset();
                  onOpenChange(false);
                }}
                disabled={isPending}
                className="text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-30 text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Create Task
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
