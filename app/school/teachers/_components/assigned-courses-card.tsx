"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { AssignedCourse } from "@/lib/models/assigned-course";
import { Course } from "@prisma/client";
import axios from "axios";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

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
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseOptions, setCourseOptions] = useState<any>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const filteredArray = courses?.filter(
      (item1) => !assignedCourses?.some((item2) => item2.course.id === item1.id)
    );

    const options = filteredArray?.map((course) => ({
      value: course.id,
      label: course.name,
    }));

    setCourseOptions(options);
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

  function handleAssign() {
    axios
      .post("/api/course-assign", { courseId: selectedCourse, teacherId })
      .then(() => {
        toast.success("Course assigned.");
        router.refresh();
      })
      .catch(() => toast.error("Something bad happend. Course not assigned!"));

    setIsPopoverOpen(false);
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
          <Popover
            open={isPopoverOpen}
            onOpenChange={() => {
              setIsPopoverOpen((current) => !current);
              setSelectedCourse("");
            }}
          >
            <PopoverTrigger asChild>
              <Button>
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Assign Course
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <p className="pb-2 text-sm font-medium">Course</p>
              <DropdownSelect
                options={courseOptions}
                onChange={(value) => setSelectedCourse(value)}
                value={selectedCourse}
              />
              <div className="flex justify-end mt-4">
                <Button
                  disabled={!selectedCourse}
                  className="ml-auto"
                  onClick={handleAssign}
                >
                  Assign
                </Button>
              </div>
            </PopoverContent>
          </Popover>
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
