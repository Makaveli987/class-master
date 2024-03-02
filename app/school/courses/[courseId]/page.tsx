import { getAssignedTeachers } from "@/actions/get-assigned-teachers";
import { getCourse } from "@/actions/get-courses";
import { getTeachers } from "@/actions/get-teachers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CourseDetails from "../_components/course-details";
import CourseDetailsHeader from "../_components/course-details-header";
import CourseTeachersCard from "../_components/course-teachers-card";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const courseData = getCourse(params.courseId);
  const assignedTeachersData = getAssignedTeachers(params.courseId);
  const teachersData = getTeachers();
  // const courseStatsData = getCourseStats(params.courseId);

  const [course, assignedTeachers, teachers] = await Promise.all([
    courseData,
    assignedTeachersData,
    teachersData,
    // courseStatsData,
  ]);

  return (
    <div className="max-w-[900px] m-auto">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Courses</h3>
      <Card>
        <CardHeader>
          <CourseDetailsHeader course={course || undefined} />
        </CardHeader>
        <CardContent>
          <Separator className="my-1" />
          <CourseDetails course={course || undefined} />

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
