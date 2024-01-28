"use client";
import React from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Course } from "@prisma/client";
import { DeleteCourseButton } from "./delete-course-button";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon } from "lucide-react";
import useCourseDialog from "@/hooks/use-course-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";

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
          Created: {formatDate(course?.createdAt!, false)}
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
