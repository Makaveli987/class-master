// "use client";
import { EnrollmentResponse } from "@/actions/get-enrolments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip2 } from "@/components/ui/tooltip2";
import useEnrollDialog, { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { formatDate } from "@/lib/utils";
import { EditIcon, MessageCirclePlusIcon, Trash2Icon } from "lucide-react";

interface EnrolledCoursesProps {
  enrollments: EnrollmentResponse[] | null;
}

function calcPercentage(x: number, y: number) {
  return (x / y) * 100;
}

export default function EnrolledCourses({ enrollments }: EnrolledCoursesProps) {
  // const enrollDialog = useEnrollDialog();

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
                {formatDate(enrollment.createdAt, true)}
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
              {enrollment.attendedClasses === enrollment.attendedClasses ? (
                <Badge className="bg-green-600 hover:bg-green-600">
                  Completed
                </Badge>
              ) : (
                <div className="w-[180px] flex flex-col gap-2">
                  <p className="text-sm text-right font-semibold leading-none">
                    {enrollment.attendedClasses}/{enrollment.totalClasses}
                  </p>
                  <Progress
                    value={calcPercentage(
                      enrollment.attendedClasses,
                      enrollment.totalClasses
                    )}
                  />
                </div>
              )}
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
