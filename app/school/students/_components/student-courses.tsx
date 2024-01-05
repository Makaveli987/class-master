import { getEnrollments } from "@/actions/get-enrolments";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import React from "react";

interface StudentCoursesProps {
  studentId: string;
}

function calcPercentage(x: number, y: number) {
  return (x / y) * 100;
}

export default async function StudentCourses({
  studentId,
}: StudentCoursesProps) {
  const enrollments = await getEnrollments(studentId);

  if (!enrollments) {
    return <p className="text-sm">The student has not attended any courses.</p>;
  }
  return (
    <div className="space-y-6">
      {enrollments.map((enrollment) => (
        <>
          <Separator />
          <div className="flex justify-between items-start">
            <div className="flex flex-col space-y-1 text-left">
              <p className="text-sm font-semibold leading-none">
                {enrollment.course.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                <span className="font-medium">started:</span>{" "}
                {formatDate(enrollment.createdAt).slice(0, -6)}
              </p>
            </div>
            <div className="flex flex-col space-y-1 text-right">
              <p className="text-sm leading-none">
                {enrollment.teacher.firstName} {enrollment.teacher.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                Teacher
              </p>
            </div>
            <div className="w-[180px] flex justify-end">
              {enrollment.attendedClasses === 40 ? (
                <Badge className="bg-green-600 hover:bg-green-600">
                  Completed
                </Badge>
              ) : (
                <div className="w-[180px] flex flex-col gap-2">
                  <p className="text-sm text-right font-semibold leading-none">
                    {enrollment.attendedClasses}/40
                  </p>
                  <Progress
                    value={calcPercentage(enrollment.attendedClasses, 40)}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ))}
    </div>
  );
}
