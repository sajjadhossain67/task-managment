import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-electric-blue/20 text-electric-blue-light border-electric-blue/30",
        secondary: "border-transparent bg-surface-elevated text-text-secondary",
        destructive:
          "border-transparent bg-danger/20 text-red-400 border-danger/30",
        outline: "text-text-secondary border-border",
        success:
          "border-transparent bg-success/20 text-[#4ade80] border-success/30",
        warning:
          "border-transparent bg-warning/20 text-[#fbbf24] border-warning/30",
        info: "border-transparent bg-info/20 text-[#22d3ee] border-info/30",
        todo: "border-transparent bg-charcoal-muted/20 text-text-secondary border-charcoal-muted/30",
        "in-progress":
          "border-transparent bg-electric-blue/20 text-electric-blue-light border-electric-blue/30",
        done: "border-transparent bg-success/20 text-[#4ade80] border-success/30",
        low: "border-transparent bg-charcoal-muted/20 text-text-secondary border-charcoal-muted/30",
        medium:
          "border-transparent bg-warning/20 text-[#fbbf24] border-warning/30",
        high: "border-transparent bg-danger/20 text-red-400 border-danger/30",
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
