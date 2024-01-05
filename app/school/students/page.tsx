import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./_components/columns";
import StudentDialog from "./_components/student-dialog";
import { getStudents } from "@/actions/get-students";
import { getCourses } from "@/actions/get-courses";
import EnrollStudentDialog from "./_components/enroll-dialog";
import { Card, CardContent } from "@/components/ui/card";
import StudentsTable from "./_components/students-table";

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div>
      <h3 className="pb-4 font-medium tracking-tight text-xl">Students</h3>
      <Card className="pt-6">
        <CardContent>
          <StudentsTable students={students || []} />
        </CardContent>
      </Card>
    </div>
  );
}
