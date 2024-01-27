import { getAssignedTeachers } from "@/actions/get-assigned-teachers";
import { getCourseStats } from "@/actions/get-course-stats";
import { getCourse } from "@/actions/get-courses";
import { getTeachers } from "@/actions/get-teachers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import CourseDetails from "../_components/course-details";
import CourseTeachersCard from "../_components/course-teachers-card";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const courseData = getCourse(params.courseId);
  const assignedTeachersData = getAssignedTeachers(params.courseId);
  const teachersData = getTeachers();
  const courseStatsData = getCourseStats(params.courseId);

  const [course, assignedTeachers, teachers, courseStats] = await Promise.all([
    courseData,
    assignedTeachersData,
    teachersData,
    courseStatsData,
  ]);

  return (
    <div className="max-w-screen-2xl">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Courses</h3>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 relative rounded-full flex justify-center items-center bg-muted">
              <Image src={`/courses.png`} alt={"test"} height={40} width={40} />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-bold tracking-tight">
                {course?.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                Created: {formatDate(course?.createdAt!, false)}
              </p>
            </div>
            <div className="ml-auto">
              {/* <DeleteGroupButton
                className="ml-auto"
                groupId={group?.id}
                buttonType="button"
              /> */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-1" />
          <CourseDetails
            course={course || undefined}
            courseStats={courseStats || undefined}
          />

          <CourseTeachersCard
            courseId={params.courseId}
            teachers={teachers}
            assignedTeachers={assignedTeachers}
          ></CourseTeachersCard>
        </CardContent>
      </Card>
    </div>
  );
}
