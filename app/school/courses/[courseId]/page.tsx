import { getCourse } from "@/actions/get-courses";
import React from "react";
import CourseForm from "../_components/course-form";
import { getCourseStats } from "@/actions/get-enrolments";
import CourseStatsCard from "../_components/course-stats-card";
import {
  BookCheckIcon,
  BookOpenTextIcon,
  GraduationCap,
  PlusCircleIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import CourseTeachersCard from "../_components/course-teachers-card";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await getCourse(params.courseId);
  const courseStats = await getCourseStats(params.courseId);

  return (
    <div>
      <h3 className="pb-4 font-semibold tracking-tight text-xl">Courses</h3>
      <div className="mb-6 flex gap-6">
        <CourseStatsCard
          title="Total Enrollments"
          amount={courseStats?.totalEnrollments}
          icon={<BookCheckIcon className="h-5 w-5 text-muted-foreground" />}
        />
        <CourseStatsCard
          title="Active Enrollments"
          amount={courseStats?.activeEnrollments}
          icon={<BookOpenTextIcon className="h-5 w-5 text-muted-foreground" />}
        />
        <CourseStatsCard
          title="Teachers"
          amount={courseStats?.totalTeachers}
          icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <div className="flex gap-6">
        <Card className="flex-1">
          <CardHeader className="mb-3">
            <CardTitle>Course Info </CardTitle>
            <CardDescription>
              This is how others will see course on the site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CourseForm data={course} action="edit" />
          </CardContent>
        </Card>

        <CourseTeachersCard
          courseId={params.courseId}
          teachers={[]}
        ></CourseTeachersCard>
      </div>
    </div>
    // </div>
  );
}
