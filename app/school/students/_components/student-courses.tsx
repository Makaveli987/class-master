"use client";
import { CourseResponse } from "@/actions/get-courses";
import { EnrollmentResponse } from "@/actions/get-enrolments";
import CourseEnrollment from "@/components/course-enrollment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useEnrollDialog, { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { cn } from "@/lib/utils";
import { BookMarkedIcon, BookmarkIcon, PlusCircleIcon } from "lucide-react";

interface StudentCoursesProps {
  studentId: string;
  enrollments: EnrollmentResponse[];
  groupEnrollments: EnrollmentResponse[];
  courses: CourseResponse[];
  isStudentActive?: boolean;
}

export default function StudentCourses({
  studentId,
  enrollments,
  groupEnrollments,
  courses,
  isStudentActive,
}: StudentCoursesProps) {
  const enrollDialog = useEnrollDialog();

  if (!enrollments) {
    return <p className="text-sm">The student has not attended any courses.</p>;
  }
  return (
    <Card className="border-0 shadow-none">
      <div className="max-w-screen-xl">
        <CardHeader className="mb-3 flex flex-row max-w-screen-xl">
          <div className="space-y-1.5">
            <CardTitle>Enrolled Courses</CardTitle>
            <CardDescription>Courses that student has attended</CardDescription>
          </div>
          <Button
            disabled={!isStudentActive}
            className="sm:ml-auto"
            onClick={() =>
              enrollDialog.open({
                userId: studentId,
                userType: EnrollUserType.STUDENT,
                courses,
                action: DialogAction.CREATE,
              })
            }
          >
            <PlusCircleIcon className="w-4 h-4 mr-2" /> Enroll Course
          </Button>
        </CardHeader>
        <CardContent
          className={cn(
            "p-0 mx-6 rounded-md",
            !enrollments.length && !groupEnrollments.length
              ? "border border-dashed"
              : "border"
          )}
        >
          {!enrollments.length && !groupEnrollments.length ? (
            <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <BookMarkedIcon className="size-7" />
                <h3 className="mt-4 text-lg font-semibold">
                  No courses enrolled.
                </h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  The student is not yet enrolled in any course.
                </p>
                <Button
                  size={"sm"}
                  onClick={() =>
                    enrollDialog.open({
                      userId: studentId,
                      userType: EnrollUserType.STUDENT,
                      courses,
                      action: DialogAction.CREATE,
                    })
                  }
                >
                  Enroll Course
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {enrollments?.map((enrollment) => (
                <CourseEnrollment
                  key={enrollment.id}
                  enrollment={enrollment}
                  userType={EnrollUserType.STUDENT}
                  courses={courses}
                />
              ))}

              {groupEnrollments?.map((enrollment) => (
                <CourseEnrollment
                  key={enrollment.id}
                  enrollment={enrollment}
                  userType={EnrollUserType.STUDENT}
                  courses={courses}
                  showGroupEnrollmentsForStudent
                />
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
