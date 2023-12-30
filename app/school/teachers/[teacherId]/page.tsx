import { getCourse } from "@/actions/get-courses";
import React from "react";
import { getCourseStats } from "@/actions/get-enrolments";
import {
  BookAIcon,
  BookCheckIcon,
  BookOpenTextIcon,
  BookTemplateIcon,
  BookTextIcon,
  BookTypeIcon,
  GraduationCap,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getCourseTeachers } from "@/actions/get-course-teachers";
import StatsCard from "@/components/cards/stats-card";
import TeacherForm from "../_components/teacher-form";
import AssignedCoursesCard from "../_components/assigned-courses-card";
import { getTeachersStats } from "@/actions/get-teachers-stats";

export default async function TeacherPage({
  params,
}: {
  params: { teacherId: string };
}) {
  //   const course = await getCourse(params.courseId);
  //   const teachers = await getCourseTeachers(params.courseId);
  const teacherStats = await getTeachersStats(params.teacherId);

  return (
    <div>
      <h3 className="pb-4 font-semibold tracking-tight text-xl">Courses</h3>
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
            <TeacherForm data={null} action="edit" />
          </CardContent>
        </Card>

        <AssignedCoursesCard
          teacherId={params.teacherId}
          courses={[]}
        ></AssignedCoursesCard>
      </div>
    </div>
  );
}
