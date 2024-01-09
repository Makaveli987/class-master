import { getTeachers } from "@/actions/get-teachers";
import { Card, CardContent } from "@/components/ui/card";
import TeachersTable from "./_components/teachers-table";

export default async function TeacherPage() {
  const teachers = await getTeachers();

  return (
    <div>
      <h3 className="pb-4 font-medium tracking-tight text-xl">Teachers</h3>
      <Card className="pt-6">
        <CardContent>
          <TeachersTable teachers={teachers || []} />
        </CardContent>
      </Card>
    </div>
  );
}
