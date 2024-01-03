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
  const [selectedCourse, setSelectedCourse] = useState<string>();
  const [selectedteacher, setSelectedTeacher] = useState<string>();

  console.log("courses", courses);

  useEffect(() => {
    if (!courses) {
      axios
        .get<Course[]>("/api/courses")
        .then((value) => {
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
      const cOptions = courses.map((course: Course) => ({
        value: course.id,
        label: course.name,
      }));
      const tOptions = courses.map((course: Course) => ({
        value: course.id,
        label: course.name,
      }));
      setCoursesOptions(cOptions);
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
              value={selectedCourse}
              options={courseOptions}
              onChange={(value: string) => {
                const selectedCourse = courses?.find(
                  (course) => course.id === value
                );
                console.log("selectedCourse :>> ", selectedCourse);
                // @ts-ignore
                const tOptions = selectedCourse.userPerCourses.map((item) => ({
                  value: item.user?.id,
                  label: `${item.user?.firstName} ${item.user?.lastName}`,
                }));
                setTeachersOptions(tOptions);
                setSelectedCourse(value);
              }}
            ></Combobox>
          </div>
          <div className="space-y-2">
            <Label>Teacher</Label>
            <Combobox
              value={selectedteacher}
              options={teachersOptions}
              onChange={(value: string) => {
                setSelectedTeacher(value);
                console.log(value);
              }}
            ></Combobox>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button asChild variant="outline">
              <DialogClose>Cancel</DialogClose>
            </Button>
            <Button>Enroll</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
