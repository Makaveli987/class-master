// "use client";
import { EnrollmentResponse } from "@/actions/get-enrolments";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { format } from "date-fns";
import { EditIcon, MessageCirclePlusIcon, Trash2Icon } from "lucide-react";
import CourseProgress from "../course-progress";

interface EnrolledCoursesProps {
  enrollments: EnrollmentResponse[] | null;
}

export default function EnrolledCourses({ enrollments }: EnrolledCoursesProps) {
  if (!enrollments) {
    return <p className="text-sm">The student has not attended any courses.</p>;
  }
  return (
    <div className="space-y-6">
      {enrollments.map((enrollment) => (
        <>
          <Separator />
          <div className="grid grid-cols-7 gap-4">
            <div className="flex flex-col col-span-2 space-y-1 text-left">
              <p className="text-sm font-semibold leading-none">
                {enrollment?.course?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                <span className="font-medium">started:</span>{" "}
                {format(enrollment?.createdAt as Date, "dd-MMM-yyyy HH:mm")}
              </p>
            </div>
            <div className="flex flex-col col-span-2 mr-4 space-y-1 text-right">
              <p className="text-sm leading-none">
                {enrollment?.teacher?.firstName} {enrollment?.teacher?.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                Teacher
              </p>
            </div>
            <div className="w-[180px] ml-auto col-span-2 flex justify-end gap-4">
              <CourseProgress
                attendedClasses={enrollment?.attendedClasses || 0}
                totalClasses={enrollment?.totalClasses || 0}
                className="mt-2"
                labelPosition="right"
                completed={enrollment?.completed || false}
              />
            </div>
            <div className="flex justify-end">
              <Tooltip2 text="Add note" side="top">
                <Button variant="ghost" className="h-8 w-8 p-0 group ">
                  <MessageCirclePlusIcon className="w-4 h-4 text-muted-foreground group-hover:text-yellow-500" />
                </Button>
              </Tooltip2>
              <Tooltip2 text="Edit" side="top">
                <Button
                  // onClick={() =>
                  //   enrollDialog.open({
                  //     data: enrollment,
                  //     userType: EnrollUserType.STUDENT,
                  //     userId: enrollment.user.id,
                  //     action:
                  //   })
                  // }
                  variant="ghost"
                  className="h-8 w-8 p-0 group "
                >
                  <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
                </Button>
              </Tooltip2>
              <Tooltip2 text="Delete" side="top">
                <Button variant="ghost" className="h-8 w-8 p-0 group ">
                  <Trash2Icon className="w-4 h-4 text-muted-foreground group-hover:text-rose-600" />
                </Button>
              </Tooltip2>
            </div>
          </div>
        </>
      ))}
    </div>
  );
}
