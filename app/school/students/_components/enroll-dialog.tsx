"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Course, User } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EnrollStudentDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios
      .get<Course[]>("/api/courses")
      .then((value) => {
        console.log({ value });
        const courseOptions = value.data.map((course: Course) => ({
          value: course.id,
          label: course.name,
        }));
        setCourses(courseOptions);
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enroll Student</DialogTitle>
          <DialogDescription>
            Select the course and teacher for the student
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 mt-3">
          <div className="space-y-2">
            <Label>Course</Label>
            <Combobox
              options={courses}
              onChange={(value: string) => {
                console.log(value);
              }}
            ></Combobox>
          </div>
          <div className="space-y-2">
            <Label>Teacher</Label>
            <Combobox
              options={courses}
              onChange={(value: string) => {
                console.log(value);
              }}
            ></Combobox>
          </div>
          <div className="flex justify-end mt-2">
            <Button className="ml-auto">Enroll</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
