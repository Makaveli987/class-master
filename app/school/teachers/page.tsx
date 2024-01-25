import { getTeachers } from "@/actions/get-teachers";
import { Card, CardContent } from "@/components/ui/card";
import TeachersTable from "./_components/teachers-table";
import { RoleGate } from "@/components/role-gate";
import { RoleType } from "@/lib/models/Roles";

export default async function TeacherPage() {
  const teachers = await getTeachers();

  return (
    <RoleGate allowedRole={RoleType.ADMIN}>
      <div className="max-w-screen-2xl">
        <h3 className="pb-4 font-medium tracking-tight text-xl">Teachers</h3>
        <Card className="pt-6">
          <CardContent>
            <TeachersTable teachers={teachers || []} />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
