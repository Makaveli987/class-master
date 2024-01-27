"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useEnrollDialog, { EnrollUserType } from "@/hooks/use-enroll-dialog";
import EnrollForm from "./enroll-form";

export default function EnrollDialog() {
  const enrollDialog = useEnrollDialog();

  return (
    <Dialog
      open={enrollDialog.isOpen}
      onOpenChange={() => {
        if (enrollDialog.isOpen) {
          enrollDialog.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Enroll{" "}
            {enrollDialog.userType === EnrollUserType.STUDENT
              ? "Student"
              : "Group"}
          </DialogTitle>
          <DialogDescription>
            Select the course and teacher for the{" "}
            {enrollDialog.userType === EnrollUserType.STUDENT
              ? "student"
              : "group"}
          </DialogDescription>
        </DialogHeader>
        <EnrollForm />
      </DialogContent>
    </Dialog>
  );
}
