import { RoleGate } from "@/components/role-gate";
import { RoleType } from "@/lib/models/role";

export default function ProfilePage() {
  return (
    <RoleGate allowedRole={RoleType.ADMIN}>
      <div className="max-w-screen-2xl m-auto">Profile</div>
    </RoleGate>
  );
}
