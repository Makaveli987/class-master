import React from "react";
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
  const variant = getClassVariant(status);

  return (
    <MerakiBadge className={className} variant={variant}>
      {status}
    </MerakiBadge>
  );
}
