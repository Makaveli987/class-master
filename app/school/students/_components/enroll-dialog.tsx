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
import { toast } from "sonner";
import useEnrollDialog from "../_hooks/useEnrollDialog";

export default function EnrollStudentDialog({
  children,
  courses,
  teachers,
}: {
  children?: React.ReactNode;
  courses?: Course[] | null;
  teachers?: User[];
}) {
  const dialog = useEnrollDialog();

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
    <Dialog open={dialog.isOpen} onOpenChange={dialog.toggle}>
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
            <Button variant="outline" onClick={dialog.close}>
              Cancel
            </Button>
            <Button>Enroll</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
