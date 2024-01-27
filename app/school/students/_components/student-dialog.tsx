"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useStudentDialog from "@/hooks/use-student-dialog";
import StudentForm from "./student-form";
import { DialogAction } from "@/lib/models/dialog-actions";

export default function StudentDialog() {
  const studentDialog = useStudentDialog();

  return (
    <Dialog
      open={studentDialog.isOpen}
      onOpenChange={() => {
        if (studentDialog.isOpen) {
          studentDialog.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-6">
            {studentDialog.action === DialogAction.CREATE
              ? "Add Student"
              : "Edit Student"}
          </DialogTitle>
        </DialogHeader>
        <StudentForm />
      </DialogContent>
    </Dialog>
  );
}
