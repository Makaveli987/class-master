"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import StudentForm from "./student-form";
import useStudentDialog from "@/hooks/use-student-dialog";

export default function StudentDialog() {
  // const [open, setOpen] = useState(false);
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
          <DialogTitle className="mb-6">Add Student</DialogTitle>
        </DialogHeader>
        <StudentForm />
      </DialogContent>
    </Dialog>
  );
}
