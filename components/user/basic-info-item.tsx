import { cn } from "@/lib/utils";

interface BasicInfoItemProps {
  children: React.ReactNode;
  className?: string;
}

export function BasicInfoItem({ children, className }: BasicInfoItemProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>{children}</div>
  );
}

export function BasicInfoIcon({ children }: BasicInfoItemProps) {
  return (
    <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
      {children}
    </div>
  );
}

interface BasicInfoLabelProps {
  children: React.ReactNode;
  label: string | number;
  labelClassName?: string;
}

export function BasicInfoLabel({
  children,
  label,
  labelClassName,
}: BasicInfoLabelProps) {
  return (
    <div className="flex flex-col text-sm">
      <span className={cn("text-muted-foreground text-xs", labelClassName)}>
        {label}
      </span>
      <div className="font-semibold">{children}</div>
    </div>
  );
}
