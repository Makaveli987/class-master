"use client";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Course, User } from "@prisma/client";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { string } from "zod";

interface EnrollDialogProps {
  children?: React.ReactNode;
  courses?: Course[] | null;
  teachers?: User[];
  studentId?: string;
}

interface Options {
  value: string;
  label: string;
}

export default function EnrollStudentDialog({
  children,
  studentId,
  courses,
  teachers = [],
}: EnrollDialogProps) {
  const [courseOptions, setCoursesOptions] = useState<ComboboxOptions[]>([]);
  const [teachersOptions, setTeachersOptions] = useState<ComboboxOptions[]>([]);

  useEffect(() => {
    if (!courses) {
      axios
        .get<Course[]>("/api/courses")
        .then((value) => {
          console.log({ value });
          const options = value.data.map((course: Course) => ({
            value: course.id,
            label: course.name,
          }));
          setCoursesOptions(options);
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    } else {
      const options = courses.map((course: Course) => ({
        value: course.id,
        label: course.name,
      }));
      setCoursesOptions(options);
    }
  }, []);

  return (
    <Dialog>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
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
              options={courseOptions}
              onChange={(value: string) => {
                console.log(value);
              }}
            ></Combobox>
          </div>
          <div className="space-y-2">
            <Label>Teacher</Label>
            {/* <Combobox
              options={courses}
              onChange={(value: string) => {
                console.log(value);
              }}
            ></Combobox> */}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Enroll</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
