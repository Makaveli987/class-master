"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { AssignedCourse } from "@/lib/models/AssignedCourse";
import { Course, User, UserPerCourse } from "@prisma/client";
import axios from "axios";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
    console.log("selected course");
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
    <Card className="flex-1 h-[608px]">
      <CardHeader className="mb-3 relative max-w-[348px]">
        <CardTitle>Courses</CardTitle>
        <CardDescription>Courses that the teacher can teach</CardDescription>
        <Popover
          open={isPopoverOpen}
          onOpenChange={() => {
            setIsPopoverOpen((current) => !current);
            setSelectedCourse("");
          }}
        >
          <PopoverTrigger asChild>
            <div className="absolute right-0 top-4">
              <Tooltip2 text="Assign course">
                <Button variant="ghost">
                  <PlusCircleIcon className="w-5 h-5" />
                </Button>
              </Tooltip2>
            </div>
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
          <ScrollArea type="always" className="h-[400px]">
            <div className="">
              {assignedCourses?.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between hover:bg-muted rounded-lg p-2 h-12 max-w-[330px] group"
                >
                  <div className="flex items-center ">
                    <div className="ml-4 ">
                      <p className="text-sm font-medium leading-none">
                        {course.course.name}
                      </p>
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
    </Card>
  );
}
