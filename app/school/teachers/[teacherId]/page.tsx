import { getCourses } from "@/actions/get-courses";

import { getAssignedCourses } from "@/actions/get-assigned-courses";
import { getTeacher } from "@/actions/get-teachers";
import { getTeachersStats } from "@/actions/get-teachers-stats";
import StatsCard from "@/components/cards/stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogAction } from "@/lib/models/dialog-actions";
import {
  BookAIcon,
  BookCheckIcon,
  BookOpenTextIcon,
  BookTextIcon,
} from "lucide-react";
import AssignedCoursesCard from "../_components/assigned-courses-card";
import TeacherForm from "../_components/teacher-form";

export default async function TeacherPage({
  params,
}: {
  params: { teacherId: string };
}) {
  const teacherData = getTeacher(params.teacherId);
  const teacherStatsData = getTeachersStats(params.teacherId);
  const coursesData = getCourses();
  const assignedCoursesData = getAssignedCourses(params.teacherId);

  const [teacher, teacherStats, courses, assignedCourses] = await Promise.all([
    teacherData,
    teacherStatsData,
    coursesData,
    assignedCoursesData,
  ]);

  return (
    <div className="max-w-screen-2xl">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Teachers</h3>
      <div className="mb-6 flex gap-6">
        <StatsCard
          title="Total Enrollments"
          amount={teacherStats?.totalEnrollments}
          icon={<BookCheckIcon className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="Active Enrollments"
          amount={teacherStats?.activeEnrollments}
          icon={<BookOpenTextIcon className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="Courses"
          amount={teacherStats?.totalCourses}
          icon={<BookAIcon className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="Total Classes"
          amount={teacherStats?.totalClasses}
          icon={<BookTextIcon className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <div className="flex gap-6">
        <Card className="flex-1">
          <CardHeader className="mb-3">
            <CardTitle>Teacher Profile</CardTitle>
            <CardDescription>
              This is how others will see this teacher on the site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeacherForm data={teacher} action={DialogAction.EDIT} />
          </CardContent>
        </Card>

        <AssignedCoursesCard
          teacherId={params.teacherId}
          courses={courses}
          assignedCourses={assignedCourses}
        ></AssignedCoursesCard>
      </div>
    </div>
  );
}
