"use client";

import { useState, useMemo, useCallback } from "react";
import type {
  Task,
  SortField,
  SortDirection,
  FilterStatus,
  FilterPriority,
} from "@/lib/types";

const DEFAULT_PAGE_SIZE = 10;

export interface UseTaskFilterResult {
  // state
  search: string;
  filterStatus: FilterStatus;
  filterPriority: FilterPriority;
  sortField: SortField;
  sortDir: SortDirection;
  page: number;
  pageSize: number;
  // derived
  filtered: Task[];
  paginated: Task[];
  totalPages: number;
  // handlers — each automatically resets to page 1
  setSearch: (v: string) => void;
  setFilterStatus: (v: FilterStatus) => void;
  setFilterPriority: (v: FilterPriority) => void;
  handleSort: (field: SortField) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: (v: number) => void;
}

export function useTaskFilter(tasks: Task[]): UseTaskFilterResult {
  const [search, setSearchRaw] = useState("");
  const [filterStatus, setFilterStatusRaw] = useState<FilterStatus>("all");
  const [filterPriority, setFilterPriorityRaw] =
    useState<FilterPriority>("all");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeRaw] = useState(DEFAULT_PAGE_SIZE);

  const resetPage = useCallback(() => setPage(1), []);

  const setSearch = useCallback(
    (v: string) => {
      setSearchRaw(v);
      resetPage();
    },
    [resetPage],
  );

  const setFilterStatus = useCallback(
    (v: FilterStatus) => {
      setFilterStatusRaw(v);
      resetPage();
    },
    [resetPage],
  );

  const setFilterPriority = useCallback(
    (v: FilterPriority) => {
      setFilterPriorityRaw(v);
      resetPage();
    },
    [resetPage],
  );

  const setPageSize = useCallback(
    (v: number) => {
      setPageSizeRaw(v);
      resetPage();
    },
    [resetPage],
  );

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("asc");
      }
      resetPage();
    },
    [sortField, resetPage],
  );

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

    return [...result].sort((a, b) => {
      let aVal: string | number = a[sortField] ?? "";
      let bVal: string | number = b[sortField] ?? "";

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [tasks, search, filterStatus, filterPriority, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return {
    search,
    filterStatus,
    filterPriority,
    sortField,
    sortDir,
    page,
    pageSize,
    filtered,
    paginated,
    totalPages,
    setSearch,
    setFilterStatus,
    setFilterPriority,
    handleSort,
    setPage,
    setPageSize,
  };
}
