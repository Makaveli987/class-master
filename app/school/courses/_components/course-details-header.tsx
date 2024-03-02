"use client";
import useCourseDialog from "@/hooks/use-course-dialog";
import { Course } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import { DeleteCourseButton } from "./delete-course-button";

interface CourseDetailsHeaderProps {
  course?: Course;
}

export default function CourseDetailsHeader({
  course,
}: CourseDetailsHeaderProps) {
  const courseDialog = useCourseDialog();

  return (
    <div className="flex flex-1 items-center gap-6 max-w-screen-4xl">
      <div className="w-16 h-16 relative rounded-full flex justify-center items-center bg-muted">
        <Image src={`/course.png`} alt={"test"} height={40} width={40} />
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="text-xl font-bold tracking-tight">{course?.name}</h2>
        <p className="text-muted-foreground text-sm">
          Created: {format(course?.createdAt as Date, "dd-MMM-yyyy")}
        </p>
      </div>
      <div className="ml-auto">
        <DeleteCourseButton
          className="ml-auto"
          courseId={course?.id}
          buttonType="button"
        />
      </div>
    </div>
  );
}
