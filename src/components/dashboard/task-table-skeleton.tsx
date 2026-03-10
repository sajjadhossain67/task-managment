"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TaskTableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {/* Filters */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Skeleton className="h-9 w-[320px]" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[4rem_1fr_7rem_7rem_10rem_8rem_6rem] gap-4 px-4 py-3 border-b border-border">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full max-w-[80%]" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[4rem_1fr_7rem_7rem_10rem_8rem_6rem] gap-4 px-4 py-4 border-b border-border last:border-0"
        >
          <Skeleton className="h-4 w-10" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>

          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>

          <Skeleton className="h-4 w-20" />

          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
