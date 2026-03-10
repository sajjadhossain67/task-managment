"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi, userApi } from "@/lib/api";
import { enrichPosts, enrichPost } from "@/lib/helpers";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

export const TASKS_QUERY_KEY = ["tasks"] as const;
export const USERS_QUERY_KEY = ["users"] as const;

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useTasks() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      const posts = await taskApi.getAll();
      return enrichPosts(posts);
    },
  });
}

export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => userApi.getAll(),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const post = await taskApi.create({
        title: input.title,
        body: input.body,
        userId: input.userId,
      });
      // JSONPlaceholder returns id=101 for all creates
      const newTask: Task = {
        ...enrichPost(post),
        status: input.status,
        priority: input.priority,
        id: Date.now(), // use timestamp for unique local id
        createdAt: new Date().toISOString(),
      };
      return newTask;
    },
    onMutate: async (newTaskInput) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      // Optimistic update
      const optimisticTask: Task = {
        id: Date.now(),
        userId: newTaskInput.userId,
        title: newTaskInput.title,
        body: newTaskInput.body,
        status: newTaskInput.status,
        priority: newTaskInput.priority,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) =>
        old ? [optimisticTask, ...old] : [optimisticTask],
      );

      return { previousTasks };
    },
    onError: (_err, _newTask, context) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, context?.previousTasks);
      toast({
        variant: "destructive",
        title: "Failed to create task",
        description: "Something went wrong. Please try again.",
      });
    },
    onSuccess: (task) => {
      // Replace optimistic entry with real one — here we just update the cache
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      toast({
        variant: "success",
        title: "Task created!",
        description: `"${task.title.slice(0, 40)}..." was added to your board.`,
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateTaskInput) => {
      await taskApi.patch(input);
      return input;
    },
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) =>
        old?.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task,
        ),
      );

      return { previousTasks };
    },
    onError: (_err, _updatedTask, context) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, context?.previousTasks);
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: "Something went wrong. Please try again.",
      });
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Task updated!",
        description: "Your changes have been saved.",
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await taskApi.delete(id);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) =>
        old?.filter((task) => task.id !== deletedId),
      );

      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, context?.previousTasks);
      toast({
        variant: "destructive",
        title: "Failed to delete task",
        description: "Something went wrong. Please try again.",
      });
    },
    onSuccess: () => {
      toast({
        variant: "destructive",
        title: "Task deleted",
        description: "The task has been removed.",
      });
    },
  });
}
