import { RoleGate } from "@/components/role-gate";
import { RoleType } from "@/lib/models/Roles";

export default function ProfilePage() {
  return (
    <RoleGate allowedRole={RoleType.ADMIN}>
      <div className="max-w-screen-2xl">Profile</div>
    </RoleGate>
  );
}
