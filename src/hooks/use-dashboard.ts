"use client";

import { useTasks, useUsers } from "./use-tasks";

/**
 * Composition hook that combines task and user queries and derives
 * a single unified loading/error state for the dashboard.
 */
export function useDashboard() {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError,
    refetch,
    isFetching,
  } = useTasks();

  const { data: users = [], isLoading: usersLoading } = useUsers();

  return {
    tasks,
    users,
    isLoading: tasksLoading || usersLoading,
    isError,
    refetch,
    isFetching,
  };
}
