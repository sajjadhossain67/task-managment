import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#3b82f6]/20 text-[#60a5fa] border-[#3b82f6]/30",
        secondary: "border-transparent bg-[#1e2533] text-[#94a3b8]",
        destructive:
          "border-transparent bg-[#ef4444]/20 text-[#f87171] border-[#ef4444]/30",
        outline: "text-[#94a3b8] border-[#2a3347]",
        success:
          "border-transparent bg-[#22c55e]/20 text-[#4ade80] border-[#22c55e]/30",
        warning:
          "border-transparent bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/30",
        info: "border-transparent bg-[#06b6d4]/20 text-[#22d3ee] border-[#06b6d4]/30",
        todo: "border-transparent bg-[#6b7a9a]/20 text-[#94a3b8] border-[#6b7a9a]/30",
        "in-progress":
          "border-transparent bg-[#3b82f6]/20 text-[#60a5fa] border-[#3b82f6]/30",
        done: "border-transparent bg-[#22c55e]/20 text-[#4ade80] border-[#22c55e]/30",
        low: "border-transparent bg-[#6b7a9a]/20 text-[#94a3b8] border-[#6b7a9a]/30",
        medium:
          "border-transparent bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/30",
        high: "border-transparent bg-[#ef4444]/20 text-[#f87171] border-[#ef4444]/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
