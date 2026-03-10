import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1117] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#3b82f6] text-white shadow-lg shadow-blue-500/25 hover:bg-[#2563eb] hover:shadow-blue-500/40 active:scale-95",
        destructive:
          "bg-[#ef4444] text-white shadow-sm hover:bg-[#dc2626] active:scale-95",
        outline:
          "border border-[#2a3347] bg-transparent text-[#94a3b8] hover:bg-[#1e2533] hover:text-[#f1f5f9] hover:border-[#374159]",
        secondary:
          "bg-[#1e2533] text-[#94a3b8] hover:bg-[#252d3d] hover:text-[#f1f5f9]",
        ghost: "text-[#94a3b8] hover:bg-[#1e2533] hover:text-[#f1f5f9]",
        link: "text-[#3b82f6] underline-offset-4 hover:underline",
        success:
          "bg-[#22c55e] text-white shadow-sm hover:bg-[#16a34a] active:scale-95",
        warning:
          "bg-[#f59e0b] text-white shadow-sm hover:bg-[#d97706] active:scale-95",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-xl px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
