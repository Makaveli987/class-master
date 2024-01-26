"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useEnrollDialog from "@/hooks/use-enroll-dialog";
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
          <DialogTitle>Enroll Student</DialogTitle>
          <DialogDescription>
            Select the course and teacher for the student
          </DialogDescription>
        </DialogHeader>
        <EnrollForm />
      </DialogContent>
    </Dialog>
  );
}
