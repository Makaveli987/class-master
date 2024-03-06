import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { MerakiBadge } from "./meraki-badge";

interface StatusBadgeProps {
  active: boolean;
  className?: string;
}

export default function StatusBadge({ active, className }: StatusBadgeProps) {
  function getClassVariant(status: string): "blue" | "rose" | "emerald" {
    if (status === "Active") return "emerald";
    if (status === "Inactive") return "rose";
    return "blue";
  }
  const status = active ? "Active" : "Inactive";
  const icon = active ? (
    <CheckCircle2Icon className="w-3 h-3 mr-1" />
  ) : (
    <XCircleIcon className="w-3 h-3 mr-1" />
  );
  const variant = getClassVariant(status);

  return (
    <MerakiBadge className={className} variant={variant}>
      <div className="flex items-center">
        {icon} {status}
      </div>
    </MerakiBadge>
  );
}
