"use client";
import { assignCourses } from "@/actions/courses/assign-courses";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComboboxOptions } from "@/components/ui/combobox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip2 } from "@/components/ui/tooltip2";
import useMultipleSelectDialog from "@/hooks/use-multiple-select-dialog";
import { AssignedCourse } from "@/lib/models/assigned-course";
import { Course } from "@prisma/client";
import axios from "axios";
import { PlusCircleIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CourseTeachersCardProps {
  teacherId: string;
  courses?: Course[] | null;
  assignedCourses?: AssignedCourse[] | null;
}

export default function AssignedTeachersCard({
  teacherId,
  courses,
  assignedCourses,
}: CourseTeachersCardProps) {
  const [initialSelectedCourses, setInitialSelectedCourses] = useState<
    string[]
  >([]);

  const [courseOptions, setCourseOptions] = useState<ComboboxOptions[]>([]);

  const multipleSelectDialog = useMultipleSelectDialog();
  const router = useRouter();

  useEffect(() => {
    const assignedCoursesOpts = assignedCourses?.map(
      (course) => course.course.id
    );

    const courseOpts = courses?.map((course) => ({
      value: course.id,
      label: course.name,
    }));

    setCourseOptions(courseOpts || []);
    setInitialSelectedCourses(assignedCoursesOpts || []);
  }, [assignedCourses, courses]);

  function handleConfirm(id: string) {
    axios
      .delete(`/api/course-assign/${id}`)
      .then(() => {
        toast.success("Course unassigned.");
        router.refresh();
      })
      .catch(() => toast.error("Something bad happend!"));
  }

  async function handleAssign(coursesIds: string[]) {
    await assignCourses(coursesIds, teacherId)
      .then(() => {
        toast.success("Courses successfully assigned.");
      })
      .catch(() => toast.error("Something bad happend. Courses not assigned!"));
  }

  return (
    <Card className="">
      <div className="max-w-4xl">
        <CardHeader className=" flex flex-row justify-between items-start">
          <div className="space-y-1.5">
            <CardTitle>Courses</CardTitle>
            <CardDescription>
              Courses that can be taught by this teacher
            </CardDescription>
          </div>
          <Button
            onClick={() =>
              multipleSelectDialog.open({
                options: courseOptions,
                initialSelectedOptions: initialSelectedCourses,
                onSubmit: handleAssign,
                dialogTitle: "Assign Courses",
                dialogDescription: "Courses that can be taught by this teacher",
              })
            }
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Assign Courses
          </Button>
        </CardHeader>
        <CardContent>
          {assignedCourses?.length === 0 ? (
            <p className="text-sm">
              There are no courses assigned to this teacher.
            </p>
          ) : (
            <ScrollArea type="always" className="max-h-[500px]">
              <div className="space-y-0">
                {assignedCourses?.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center hover:bg-muted rounded-lg  max-w-[480px] group cursor-pointer"
                  >
                    <div
                      className="flex flex-1 items-center"
                      onClick={() =>
                        router.push(`/school/courses/${course.course.id}`)
                      }
                    >
                      <div className="flex gap-3 items-center px-2 py-1 hover:bg-muted rounded-md cursor-pointer">
                        <div className="rounded-full flex items-center justify-center w-8 h-8 bg-muted relative">
                          <Image
                            src="/course.png"
                            width={28}
                            height={28}
                            alt="student"
                            className="rounded-full"
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {course.course.name}
                        </span>
                      </div>
                    </div>

                    <ConfirmDialog
                      description={
                        "This action will remove teacher from this course. You will not be able to assign students to this course with this teacher."
                      }
                      onConfirm={() => handleConfirm(course.id)}
                    >
                      <div>
                        <Tooltip2 text="Unassign course">
                          <Button
                            className="hidden group-hover:block"
                            variant="ghost"
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        </Tooltip2>
                      </div>
                    </ConfirmDialog>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
