import { getAssignedTeachers } from "@/actions/get-assigned-teachers";
import { getCourseStats } from "@/actions/get-course-stats";
import { getCourse } from "@/actions/get-courses";
import { getTeachers } from "@/actions/get-teachers";
import StatsCard from "@/components/cards/stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogAction } from "@/lib/models/dialog-actions";
import { BookCheckIcon, BookOpenTextIcon, GraduationCap } from "lucide-react";
import CourseForm from "../_components/course-form";
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
      <div className="mb-6 flex gap-6">
        <StatsCard
          title="Total Enrollments"
          amount={courseStats?.totalEnrollments}
          icon={<BookCheckIcon className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="Active Enrollments"
          amount={courseStats?.activeEnrollments}
          icon={<BookOpenTextIcon className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="Teachers"
          amount={courseStats?.totalTeachers}
          icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <div className="flex gap-6">
        <Card className="flex-1">
          <CardHeader className="mb-3">
            <CardTitle>Course Info</CardTitle>
            <CardDescription>
              This is how others will see course on the site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CourseForm data={course} action={DialogAction.EDIT} />
          </CardContent>
        </Card>

        <CourseTeachersCard
          courseId={params.courseId}
          teachers={teachers}
          assignedTeachers={assignedTeachers}
        ></CourseTeachersCard>
      </div>
    </div>
  );
}
