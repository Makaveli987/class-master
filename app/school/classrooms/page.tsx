import { getClassrooms } from "@/actions/get-classrooms";
import { RoleGate } from "@/components/role-gate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Classrooms from "./_components/classrooms";
import { RoleType } from "@/lib/models/role";

export default async function ClassroomsPage() {
  const classrooms = await getClassrooms();

  return (
    <RoleGate allowedRole={RoleType.ADMIN}>
      <div className="max-w-[900px] m-auto">
        <h3 className="pb-4 font-medium tracking-tight text-xl">Classrooms</h3>
        <Card>
          <CardHeader className="mb-3">
            <CardTitle>School classrooms</CardTitle>
            <CardDescription>List of classrooms at your school</CardDescription>
          </CardHeader>
          <CardContent>
            <Classrooms classrooms={classrooms} />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
