"use client";
import { EnrollmentResponse } from "@/actions/get-enrolments";
import useEnrollDialog, { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { useNoteDialog } from "@/hooks/use-note-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";

import { CourseResponse } from "@/actions/get-courses";
import axios from "axios";
import { format } from "date-fns";
import {
  EditIcon,
  EyeIcon,
  MessageCirclePlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import CourseProgress from "./course-progress";
import { Button } from "./ui/button";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { Tooltip2 } from "./ui/tooltip2";

interface CourseEnrollmentProps {
  enrollment: EnrollmentResponse;
  userType: EnrollUserType;
  courses: CourseResponse[];
  showGroupEnrollmentsForStudent?: boolean;
}

export default function CourseEnrollment({
  enrollment,
  userType,
  courses,
  showGroupEnrollmentsForStudent = false,
}: CourseEnrollmentProps) {
  const enrollDialog = useEnrollDialog();
  const noteDialog = useNoteDialog();
  const router = useRouter();

  function handleConfirm(id: string) {
    axios
      .delete(`/api/enrollment/${id}`)
      .then(() => {
        toast.success("Enrollment succesfully deleted.");
        router.refresh();
      })
      .catch(() =>
        toast.error("Something bad happend! Enrollment wasn't deleted.")
      );
  }

  return (
    <div key={enrollment.id}>
      <Separator />
      <div className="grid grid-cols-7 gap-4  pl-2 hover:bg-muted cursor-pointer">
        <div
          className="flex flex-col col-span-2 space-y-1 text-left py-6"
          onClick={() => router.push(`/school/enrollments/${enrollment.id}`)}
        >
          <p className="text-sm font-semibold leading-none">
            {enrollment?.course?.name}{" "}
            {showGroupEnrollmentsForStudent && `(${enrollment.group?.name})`}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            <span className="font-medium">Enrolled:</span>{" "}
            {format(enrollment?.createdAt as Date, "dd-MMM-yyyy")}
          </p>
        </div>
        <div
          className="flex flex-col col-span-2 mr-4 space-y-1 text-right py-6"
          onClick={() => router.push(`/school/enrollments/${enrollment.id}`)}
        >
          <p className="text-sm leading-none">
            {enrollment?.teacher?.firstName} {enrollment?.teacher?.lastName}
          </p>
          <p className="text-xs leading-none text-muted-foreground">Teacher</p>
        </div>
        <div
          className="w-[180px] ml-auto col-span-2 flex justify-end gap-4 py-6"
          onClick={() => router.push(`/school/enrollments/${enrollment.id}`)}
        >
          <CourseProgress
            attendedClasses={enrollment?.attendedClasses || 0}
            totalClasses={enrollment?.totalClasses || 0}
            className="mt-2"
            labelPosition="right"
          />
        </div>
        <div className="flex justify-end py-6">
          {showGroupEnrollmentsForStudent && (
            <Tooltip2 text="Add note" side="top">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 group"
                onClick={() =>
                  router.push(`/school/enrollments/${enrollment.id}`)
                }
              >
                <EyeIcon className="w-[18px] h-[18px] text-muted-foreground group-hover:text-blue-500" />
              </Button>
            </Tooltip2>
          )}

          {!showGroupEnrollmentsForStudent && (
            <Tooltip2 text="Add note" side="top">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  noteDialog.open({
                    enrollmentId: enrollment.id,
                    userId:
                      userType === EnrollUserType.GROUP
                        ? (enrollment.groupId as string)
                        : (enrollment.studentId as string),
                  });
                }}
                variant="ghost"
                className="h-8 w-8 p-0 group "
              >
                <MessageCirclePlusIcon className="w-4 h-4 text-muted-foreground group-hover:text-yellow-500" />
              </Button>
            </Tooltip2>
          )}
          {!showGroupEnrollmentsForStudent && (
            <Tooltip2 text="Edit" side="top">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 group"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("enrollment", enrollment);
                  enrollDialog.open({
                    data: enrollment,
                    userType: enrollment.groupId
                      ? EnrollUserType.GROUP
                      : EnrollUserType.STUDENT,
                    userId:
                      userType === EnrollUserType.GROUP
                        ? (enrollment.groupId as string)
                        : (enrollment.studentId as string),
                    courses,
                    action: DialogAction.EDIT,
                  });
                }}
              >
                <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
              </Button>
            </Tooltip2>
          )}
          {!showGroupEnrollmentsForStudent && (
            <ConfirmDialog
              description={
                "This action will remove enrollment for this student. You will not be able to schedule classes for thsi enrollment."
              }
              onConfirm={() => handleConfirm(enrollment.id)}
            >
              <div>
                <Tooltip2 text="Delete" side="top">
                  <Button variant="ghost" className="h-8 w-8 p-0 group">
                    <Trash2Icon className="w-4 h-4 text-muted-foreground group-hover:text-rose-600" />
                  </Button>
                </Tooltip2>
              </div>
            </ConfirmDialog>
          )}
        </div>
      </div>
    </div>
  );
}
