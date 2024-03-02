import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        "outline-destructive":
          "border border-destructive bg-background shadow-sm text-destructive hover:bg-destructive/5",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        "ghost-destructive": "hover:bg-destructive/5 hover:text-destructive",
        link: "text-primary underline-offset-4 hover:underline",
        red: "bg-red-500 text-red-50 dark:bg-red-700",
        orange: "bg-orange-500 text-orange-50 dark:bg-orange-700",
        amber: "bg-amber-500 text-amber-50 dark:bg-amber-700",
        yellow: "bg-yellow-500 text-yellow-50 dark:bg-yellow-700",
        lime: "bg-lime-500 text-lime-50 dark:bg-lime-700",
        green: "bg-green-500 text-green-50 dark:bg-green-700",
        emerald: "bg-emerald-500 text-emerald-50 dark:bg-emerald-700",
        teal: "bg-teal-500 text-teal-50 dark:bg-teal-700",
        cyan: "bg-cyan-500 text-cyan-50 dark:bg-cyan-700",
        sky: "bg-sky-500 text-sky-50 dark:bg-sky-700",
        blue: "bg-blue-500 text-blue-50 dark:bg-blue-700",
        indigo: "bg-indigo-500 text-indigo-50 dark:bg-indigo-700",
        violet: "bg-violet-500 text-violet-50 dark:bg-violet-700",
        purple: "bg-purple-500 text-purple-50 dark:bg-purple-700",
        fuchsia: "bg-fuchsia-500 text-fuchsia-50 dark:bg-fuchsia-700",
        pink: "bg-pink-500 text-pink-50 dark:bg-pink-700",
        rose: "bg-rose-500 text-rose-50 dark:bg-rose-700",
        "sidebar-active": "bg-blue-50 text-blue-500",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
