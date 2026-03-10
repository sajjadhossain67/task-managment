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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-electric-blue/10">
              <Sparkles className="w-5 h-5 text-electric-blue-light" />
            </div>
            <div>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to your board. Fill in the details below.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Task Title <span className="text-danger">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Implement authentication flow..."
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-[#f87171]">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Label htmlFor="body">
                Description <span className="text-danger">*</span>
              </Label>
              <span className="text-xs text-text-muted">{charCount}/500</span>
            </div>
            <Textarea
              id="body"
              placeholder="Describe the task in detail..."
              rows={4}
              {...register("body")}
            />
            {errors.body && (
              <p className="text-xs text-[#f87171]">{errors.body.message}</p>
            )}
          </div>

          {/* Row: Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                defaultValue="todo"
                onValueChange={(v) =>
                  setValue("status", v as FormValues["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">📋 To Do</SelectItem>
                  <SelectItem value="in-progress">⚡ In Progress</SelectItem>
                  <SelectItem value="done">✅ Done</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-[#f87171]">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                defaultValue="medium"
                onValueChange={(v) =>
                  setValue("priority", v as FormValues["priority"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-1.5">
            <Label>
              Assignee <span className="text-danger">*</span>
            </Label>
            <Select
              defaultValue="1"
              onValueChange={(v) => setValue("userId", Number(v))}
            >
              <SelectTrigger>
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
              <p className="text-xs text-[#f87171]">{errors.userId.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-30">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
