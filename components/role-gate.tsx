"use client";

import { Role } from "@prisma/client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { RoleType } from "@/lib/models/Roles";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: RoleType;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      //   <FormError message="You do not have permission to view this content!" />
      <p>You do not have permission to view this content!</p>
    );
  }

  return <>{children}</>;
};
