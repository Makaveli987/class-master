"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useCourseDialog from "@/hooks/use-course-dialog";
import CourseForm from "./course-form";

export default function CourseDialog() {
  const studentDialog = useCourseDialog();

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
          <DialogTitle className="mb-6">Add Course</DialogTitle>
          <CourseForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
