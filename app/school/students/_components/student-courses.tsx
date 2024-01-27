"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip2 } from "@/components/ui/tooltip2";
import useEnrollDialog, { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { useNoteDialog } from "@/hooks/use-note-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { calcPercentage, formatDate } from "@/lib/utils";
import {
  EditIcon,
  MessageCirclePlusIcon,
  PlusCircleIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface StudentCoursesProps {
  studentId: string;
  enrollments: any[];
  courses: any[];
}

export default function StudentCourses({
  studentId,
  enrollments,
  courses,
}: StudentCoursesProps) {
  const enrollDialog = useEnrollDialog();
  const noteDialog = useNoteDialog();
  const router = useRouter();

  console.log("enrollments", enrollments);

  if (!enrollments) {
    return <p className="text-sm">The student has not attended any courses.</p>;
  }
  return (
    <div className="max-w-4xl">
      <CardHeader>
        <CardTitle>Courses</CardTitle>
        <CardDescription>Courses that student has attended</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div>
          {enrollments.map((enrollment) => (
            <div key={enrollment.id}>
              <Separator />
              <div
                onClick={() =>
                  router.push(`/school/enrollments/${enrollment.id}`)
                }
                className="grid grid-cols-7 gap-4 py-6 pl-2 hover:bg-muted cursor-pointer"
              >
                <div className="flex flex-col col-span-2 space-y-1 text-left">
                  <p className="text-sm font-semibold leading-none">
                    {enrollment.course.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    <span className="font-medium">Enrolled:</span>{" "}
                    {formatDate(enrollment.createdAt).slice(0, -6)}
                  </p>
                </div>
                <div className="flex flex-col col-span-2 mr-4 space-y-1 text-right">
                  <p className="text-sm leading-none">
                    {enrollment.teacher.firstName} {enrollment.teacher.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Teacher
                  </p>
                </div>
                <div className="w-[180px] ml-auto col-span-2 flex justify-end gap-4">
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
                <div className="flex justify-end">
                  <Tooltip2 text="Add note" side="top">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        noteDialog.open({
                          enrollmentId: enrollment.id,
                          userId: studentId,
                        });
                      }}
                      variant="ghost"
                      className="h-8 w-8 p-0 group "
                    >
                      <MessageCirclePlusIcon className="w-4 h-4 text-muted-foreground group-hover:text-yellow-500" />
                    </Button>
                  </Tooltip2>
                  <Tooltip2 text="Edit" side="top">
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 group"
                      onClick={(e) => {
                        console.log("Edit clicked");

                        e.stopPropagation();

                        enrollDialog.open({
                          data: {
                            enrollmentId: enrollment.id,
                            courseId: enrollment.course.id,
                            teacherId: enrollment.teacher.id,
                            courseGoals: enrollment.courseGoals,
                          },
                          userType: EnrollUserType.STUDENT,
                          userId: enrollment.studentId,
                          courses,
                          action: DialogAction.EDIT,
                        });
                      }}
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
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button
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
        </div>
      </CardContent>
    </div>
  );
}
