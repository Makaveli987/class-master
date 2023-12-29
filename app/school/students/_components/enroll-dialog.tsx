"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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
import { toast } from "sonner";
import { string } from "zod";

interface EnrollDialogProps {
  children?: React.ReactNode;
  courses?: Course[] | null;
  teachers?: User[];
  studentId?: string;
}

export default function EnrollStudentDialog({
  children,
  courses,
  teachers,
  studentId,
}: EnrollDialogProps) {
  console.log({ courses });
  console.log({ teachers });

  const courseOptions = courses?.map((course: Course) => ({
    value: course.id,
    label: course.name,
  }));

  // const [courses, setCourses] = useState([]);
  // const [teachers, setTeachers] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get<Course[]>("/api/courses")
  //     .then((value) => {
  //       console.log({ value });
  //       const courseOptions = value.data.map((course: Course) => ({
  //         value: course.id,
  //         label: course.name,
  //       }));
  //       setCourses(courseOptions);
  //     })
  //     .catch(() => {
  //       toast.error("Something went wrong");
  //     });
  // }, []);

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
              options={courseOptions || []}
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
