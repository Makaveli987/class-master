import { getStudents } from "@/actions/get-students";
import { Card, CardContent } from "@/components/ui/card";
import StudentsTable from "./_components/students-table";

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="max-w-screen-2xl">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Students</h3>
      <Card className="pt-6">
        <CardContent>
          <StudentsTable students={students || []} />
        </CardContent>
      </Card>
    </div>
  );
}
