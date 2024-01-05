import { getCourses } from "@/actions/get-courses";

import { Card, CardContent } from "@/components/ui/card";
import CoursesTable from "./_components/courses-table";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <>
      <h3 className="pb-4 font-medium tracking-tight text-xl">Courses</h3>
      <Card className="pt-6">
        <CardContent>
          <CoursesTable courses={courses || []} />
        </CardContent>
      </Card>
    </>
  );
}
