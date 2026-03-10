"use client";

import { useEffect } from "react";
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
import { useUpdateTask } from "@/hooks/use-tasks";
import type { Task, User } from "@/lib/types";
import { Loader2, Pencil } from "lucide-react";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  body: z.string().min(5, "Description must be at least 5 characters").max(500),
  userId: z.number().min(1, "Please select an assignee"),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
});

type FormValues = z.infer<typeof schema>;

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  users: User[];
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  users,
}: EditTaskDialogProps) {
  const { mutate: updateTask, isPending } = useUpdateTask();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        body: task.body,
        userId: task.userId,
        status: task.status,
        priority: task.priority,
      });
    }
  }, [task, reset]);

  const onSubmit = (data: FormValues) => {
    if (!task) return;
    updateTask(
      { id: task.id, ...data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const charCount = watch("body")?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#f59e0b]/10">
              <Pencil className="w-5 h-5 text-[#fbbf24]" />
            </div>
            <div>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Update the details for task #{task?.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">
              Task Title <span className="text-[#ef4444]">*</span>
            </Label>
            <Input
              id="edit-title"
              placeholder="Task title..."
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-[#f87171]">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Label htmlFor="edit-body">
                Description <span className="text-[#ef4444]">*</span>
              </Label>
              <span className="text-xs text-[#64748b]">{charCount}/500</span>
            </div>
            <Textarea
              id="edit-body"
              placeholder="Task description..."
              rows={4}
              {...register("body")}
            />
            {errors.body && (
              <p className="text-xs text-[#f87171]">{errors.body.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={watch("status")}
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
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={watch("priority")}
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

          <div className="space-y-1.5">
            <Label>Assignee</Label>
            <Select
              value={String(watch("userId"))}
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
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="warning"
              disabled={isPending}
              className="min-w-[120px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
