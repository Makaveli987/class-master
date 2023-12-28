import { getCourses } from "@/actions/get-courses";
import { DataTable } from "@/components/ui/data-table/data-table";
import CourseDialog from "./_components/course-dialog";
import { columns } from "./_components/columns";

export default async function CoursesPage() {
  const data = await getCourses();

  return (
    <div>
      <h3 className="pb-4 font-medium tracking-tight text-xl">Courses</h3>
      <div className="bg-white w-full rounded-md border p-5">
        <DataTable
          columns={columns}
          data={data || []}
          filterPlaceholder="Search students..."
        >
          <CourseDialog />
        </DataTable>
      </div>
    </div>
  );
}
