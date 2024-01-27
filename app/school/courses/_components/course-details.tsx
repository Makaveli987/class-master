"use client";
import StatsCard from "@/components/cards/stats-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useCourseDialog from "@/hooks/use-course-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { Course } from "@prisma/client";
import { BookCheckIcon, BookOpenTextIcon, EditIcon } from "lucide-react";

interface CourseDetailsProps {
  course?: Course;
  courseStats?: { totalEnrollments: number; activeEnrollments: number };
}

export default function CourseDetails({
  course,
  courseStats,
}: CourseDetailsProps) {
  const courseDialog = useCourseDialog();
  return (
    <div className="max-w-4xl pt-4 pr-6 ">
      <div className="flex gap-16 justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Description</h3>
          <p className="text-sm text-muted-foreground">
            {course?.description ? course.description : "-"}
          </p>
        </div>
        <Button
          onClick={() => {
            courseDialog.open({
              data: course,
              action: DialogAction.EDIT,
            });
          }}
          variant="outline"
        >
          <EditIcon className="w-4 h-4 mr-2" /> Edit
        </Button>
      </div>

      <Separator className="my-6" />

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
      </div>
    </div>
  );
}
