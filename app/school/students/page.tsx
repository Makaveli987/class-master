import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./_components/columns";
import StudentDialog from "./_components/student-dialog";
import { getStudents } from "@/actions/get-students";
import { getCourses } from "@/actions/get-courses";
import EnrollStudentDialog from "./_components/enroll-dialog";

export default async function StudentsPage() {
  const students = await getStudents();
  const courses = await getCourses();

  return (
    <div>
      <h3 className="pb-4 font-semibold tracking-tight text-xl">Students</h3>
      <div className="bg-white w-full rounded-md border p-5">
        <DataTable
          columns={columns}
          data={students || []}
          filterPlaceholder="Search students..."
        >
          <StudentDialog />
        </DataTable>
      </div>
      <EnrollStudentDialog courses={courses} />
    </div>
  );
}
