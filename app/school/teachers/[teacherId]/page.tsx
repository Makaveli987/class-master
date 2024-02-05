import { getCourses } from "@/actions/get-courses";

import { getAssignedCourses } from "@/actions/get-assigned-courses";
import { getTeacher } from "@/actions/get-teachers";
import { getTeachersStats } from "@/actions/get-teachers-stats";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AssignedCoursesCard from "../_components/assigned-courses-card";

import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { DeleteTeacherButton } from "../_components/delete-course-button";
import TeacherDetails from "../_components/teacher-details";
import { countEnrollmentsByMonth } from "@/actions/get-last-six-month";

export default async function TeacherPage({
  params,
}: {
  params: { teacherId: string };
}) {
  const teacherData = getTeacher(params.teacherId);
  const teacherStatsData = getTeachersStats(params.teacherId);
  const coursesData = getCourses();
  const assignedCoursesData = getAssignedCourses(params.teacherId);

  const [teacher, courses, assignedCourses] = await Promise.all([
    teacherData,
    coursesData,
    assignedCoursesData,
  ]);

  return (
    <div className="max-w-screen-2xl">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Teachers</h3>

      <Card className="flex-1">
        <CardHeader>
          <div className="flex gap-6 items-center">
            <div className="w-16 h-16 relative rounded-full flex justify-center items-center bg-muted">
              <Image
                src="/teacher.png"
                alt={"teacher"}
                fill
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-bold tracking-tight">
                {teacher?.firstName + " " + teacher?.lastName}
              </h2>
              <p className="text-muted-foreground text-sm">
                Created: {formatDate(teacher?.createdAt!, false)}
              </p>
            </div>
            <div className="ml-auto">
              <DeleteTeacherButton
                teacherId={params.teacherId}
                buttonType="button"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-1" />

          <TeacherDetails teacher={teacher || undefined} />

          <AssignedCoursesCard
            teacherId={params.teacherId}
            courses={courses}
            assignedCourses={assignedCourses}
          ></AssignedCoursesCard>
        </CardContent>
      </Card>
    </div>
  );
}
