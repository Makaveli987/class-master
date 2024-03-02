import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const merakiBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        emerald:
          "bg-emerald-100/60 text-emerald-500 dark:bg-primary-foreground",
        violet: "bg-violet-100/60 text-violet-500 dark:bg-primary-foreground",
        purple: "bg-purple-100/60 text-purple-500 dark:bg-primary-foreground",
        orange: "bg-orange-100/60 text-orange-500 dark:bg-primary-foreground",
        blue: "bg-blue-100/60 text-blue-500 dark:bg-primary-foreground",
        rose: "bg-rose-100/60 text-rose-500 dark:bg-primary-foreground",
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
