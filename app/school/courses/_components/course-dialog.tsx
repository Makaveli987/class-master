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
import CourseForm from "./course-form";

export default function CourseDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-6">Add Course</DialogTitle>
          <CourseForm setDialogOpen={setOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
