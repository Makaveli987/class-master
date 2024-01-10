"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useEnrollDialog, { EnrollUserType } from "@/hooks/useEnrollDialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import EnrollForm, { EnrollFormCourse } from "./enroll-form";

interface EnrollDialogProps {
  children?: React.ReactNode;
  courses?: EnrollFormCourse[] | null;
  userId: string;
  userType: EnrollUserType;
}

export default function EnrollDialog({
  children,
  userId,
  courses,
  userType,
}: EnrollDialogProps) {
  const enrollDialog = useEnrollDialog();

  return (
    <Dialog
      open={enrollDialog.isOpen}
      onOpenChange={() => {
        if (enrollDialog.isOpen) {
          enrollDialog.close();
        } else {
          enrollDialog.open(
            {
              courseId: enrollDialog.data.courseId,
              teacherId: enrollDialog.data.teacherId,
              courseGoals: enrollDialog.data.courseGoals,
            },
            userType,
            DialogAction.CREATE
          );
        }
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enroll Student</DialogTitle>
          <DialogDescription>
            Select the course and teacher for the student
          </DialogDescription>
        </DialogHeader>
        <EnrollForm
          userId={userId}
          userType={userType}
          courses={courses}
          enrollData={enrollDialog.data}
          action={DialogAction.CREATE}
        />
      </DialogContent>
    </Dialog>
  );
}
