import { getCourses } from "@/actions/get-courses";

import { getAssignedCourses } from "@/actions/get-assigned-courses";
import { getTeacher } from "@/actions/get-teachers";
import { getTeachersStats } from "@/actions/get-teachers-stats";
import { Card, CardContent } from "@/components/ui/card";
import AssignedCoursesCard from "../_components/assigned-courses-card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart4Icon, BookAIcon } from "lucide-react";
import ClassStatisticsTable from "../_components/class-statistics-table";
import TeacherDetails from "../_components/teacher-details";

export default async function TeacherPage({
  params,
}: {
  params: { teacherId: string };
}) {
  const teacherData = getTeacher(params.teacherId);
  const coursesData = getCourses();
  const assignedCoursesData = getAssignedCourses(params.teacherId);

  const [teacher, courses, assignedCourses] = await Promise.all([
    teacherData,
    coursesData,
    assignedCoursesData,
  ]);

  return (
    <div className="max-w-[1200px] m-auto flex gap-6">
      <Card className="flex-1">
        <CardContent className="flex p-0">
          <TeacherDetails teacher={teacher || undefined} />

          <div className="py-6 px-8 flex-1">
            <Tabs
              defaultValue="assignedCourses"
              className="w-full overflow-auto flex flex-col"
            >
              <TabsList className="justify-start flex-1">
                <TabsTrigger className="min-w-28 px-4" value="assignedCourses">
                  <BookAIcon className="w-4 h-4 mr-1" />
                  Assigned Courses
                </TabsTrigger>
                <TabsTrigger className="min-w-28 px-4 " value="classStatistics">
                  <BarChart4Icon className="w-4 h-4 mr-1" />
                  Class Statistics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="assignedCourses">
                <AssignedCoursesCard
                  teacherId={params.teacherId}
                  courses={courses}
                  assignedCourses={assignedCourses}
                ></AssignedCoursesCard>
              </TabsContent>
              <TabsContent value="classStatistics">
                <ClassStatisticsTable teacherId={teacher!.id} />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
