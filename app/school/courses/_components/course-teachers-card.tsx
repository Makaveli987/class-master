"use client";
import { assignTeachers } from "@/actions/courses/assign-teachers";
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
import { User } from "@prisma/client";
import axios from "axios";
import { PlusCircleIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CourseTeachersCardProps {
  courseId: string;
  teachers: User[] | null;
  assignedTeachers?: AssignedCourse[] | null;
}

export default function CourseTeachersCard({
  courseId,
  teachers,
  assignedTeachers,
}: CourseTeachersCardProps) {
  const [initialSelectedCourses, setInitialSelectedCourses] = useState<
    string[]
  >([]);

  const [teachersOptions, setTeachersOptions] = useState<ComboboxOptions[]>([]);

  const multipleSelectDialog = useMultipleSelectDialog();
  const router = useRouter();

  useEffect(() => {
    const assignedTeachersOpts = assignedTeachers?.map(
      (teacher) => teacher.user.id
    );

    const teacherOpts = teachers?.map((teacher) => ({
      value: teacher.id,
      label: `${teacher.firstName} ${teacher.lastName}`,
    }));

    setTeachersOptions(teacherOpts || []);
    setInitialSelectedCourses(assignedTeachersOpts || []);
  }, [assignedTeachers, teachers]);

  function handleConfirm(id: string) {
    axios
      .delete(`/api/course-assign/${id}`)
      .then(() => {
        toast.success("Course unassigned.");
        router.refresh();
      })
      .catch(() => toast.error("Something bad happend!"));
  }

  async function handleAssign(teachersIds: string[]) {
    await assignTeachers(teachersIds, courseId)
      .then(() => {
        toast.success("Teachers successfully assigned.");
      })
      .catch(() =>
        toast.error("Something bad happend. Teachers not assigned!")
      );
  }

  return (
    <Card>
      <div className="max-w-4xl">
        <CardHeader className="flex flex-row justify-between items-start">
          <div className="space-y-1.5">
            <CardTitle>Teachers</CardTitle>
            <CardDescription>
              Teachers that can teach this course
            </CardDescription>
          </div>
          <Button
            onClick={() =>
              multipleSelectDialog.open({
                options: teachersOptions,
                initialSelectedOptions: initialSelectedCourses,
                onSubmit: handleAssign,
                dialogTitle: "Assign Teachers",
                dialogDescription: "Teachers that can teach this course",
              })
            }
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Assign Teacher
          </Button>
        </CardHeader>
        <CardContent>
          {assignedTeachers?.length === 0 ? (
            <p className="text-sm">
              There are no teachers assigned to this course.
            </p>
          ) : (
            <ScrollArea type="always" className="max-h-[400px]">
              <div className="space-y-0">
                {assignedTeachers?.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center hover:bg-muted rounded-lg  max-w-[410px] group cursor-pointer"
                  >
                    <div
                      className="flex items-center flex-1"
                      onClick={() =>
                        router.push(`/school/teachers/${teacher.user.id}`)
                      }
                    >
                      <div className="flex gap-3 items-center px-2 py-1 hover:bg-muted rounded-md cursor-pointer">
                        <div className="rounded-full flex items-center justify-center w-8 h-8 bg-muted relative">
                          <Image
                            src="/teacher.png"
                            width={28}
                            height={28}
                            alt="student"
                            className="rounded-full"
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {`${teacher?.user?.firstName} ${teacher?.user?.lastName}`}
                        </span>
                      </div>
                    </div>

                    <ConfirmDialog
                      description={
                        "This action will remove teacher from this course. You will not be able to assign students to this course with this teacher."
                      }
                      onConfirm={() => handleConfirm(teacher.id)}
                    >
                      <div>
                        <Tooltip2 text="Unassign teacher">
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
