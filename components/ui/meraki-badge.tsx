import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const merakiBadgeVariants = cva(
  "inline-flex items-center rounded px-2.5 py-0.5 h-[22px] text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border border-transparent",
        emerald:
          "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 border-transparent",
        violet:
          "bg-violet-100 text-violet-600 dark:bg-violet-500/20 border-transparent",
        purple:
          "bg-purple-100 text-purple-600 dark:bg-purple-500/20 border-transparent",
        orange:
          "bg-orange-100 text-orange-600 dark:bg-orange-500/20 border-transparent",
        blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 border-transparent",
        rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface MerakiBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof merakiBadgeVariants> {}

function MerakiBadge({ className, variant, ...props }: MerakiBadgeProps) {
  return (
    <div
      className={cn(merakiBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { MerakiBadge, merakiBadgeVariants };
