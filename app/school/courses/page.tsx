import { getCourses } from "@/actions/get-courses";
import { DataTable } from "@/components/ui/data-table/data-table";
import CourseDialog from "./_components/course-dialog";
import { columns } from "./_components/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CoursesPage() {
  const data = await getCourses();

  return (
    <>
      <h3 className="pb-4 font-medium tracking-tight text-xl">Courses</h3>
      <Card className="pt-6">
        <CardContent>
          <DataTable
            columns={columns}
            data={data || []}
            filterPlaceholder="Search courses..."
          >
            <CourseDialog />
          </DataTable>
        </CardContent>
      </Card>
    </>
  );
}
