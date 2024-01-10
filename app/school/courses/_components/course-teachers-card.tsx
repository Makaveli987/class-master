"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { User } from "@prisma/client";
import axios from "axios";
import { PlusCircleIcon, XIcon } from "lucide-react";
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
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [teachersOptions, setTeachersOptions] = useState<any>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const filteredArray = teachers?.filter(
      (teacher) =>
        !assignedTeachers?.some(
          (assignedTeacher) => assignedTeacher.user.id === teacher.id
        )
    );

    const options = filteredArray?.map((teacher) => ({
      value: teacher.id,
      label: `${teacher.firstName} ${teacher.lastName}`,
    }));

    console.log("options", options);

    setTeachersOptions(options);
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

  function handleAssign() {
    console.log("selected course");
    axios
      .post("/api/course-assign", { courseId, teacherId: selectedTeacher })
      .then(() => {
        toast.success("Course assigned.");
        router.refresh();
      })
      .catch(() => toast.error("Something bad happend. Course not assigned!"));

    setIsPopoverOpen(false);
  }

  return (
    <Card className="flex-1 h-[524px]">
      <CardHeader className="mb-3 relative max-w-[348px]">
        <CardTitle>Teachers</CardTitle>
        <CardDescription>Teachers that can teach this course</CardDescription>
        <Popover
          open={isPopoverOpen}
          onOpenChange={() => {
            setIsPopoverOpen((current) => !current);
            setSelectedTeacher("");
          }}
        >
          <PopoverTrigger asChild>
            <div className="absolute right-0 top-4">
              <Tooltip2 text="Assign teacher">
                <Button variant="ghost">
                  <PlusCircleIcon className="w-5 h-5" />
                </Button>
              </Tooltip2>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <p className="pb-2 text-sm font-medium">Course</p>
            <DropdownSelect
              options={teachersOptions || []}
              onChange={(value) => setSelectedTeacher(value)}
              value={selectedTeacher}
            />
            <div className="flex justify-end mt-4">
              <Button
                disabled={!selectedTeacher}
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
        {assignedTeachers?.length === 0 ? (
          <p className="text-sm">
            There are no teachers assigned to this course.
          </p>
        ) : (
          <ScrollArea type="always" className="h-[400px]">
            <div className="space-y-4">
              {assignedTeachers?.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between hover:bg-muted rounded-lg p-2 max-w-[330px] group cursor-pointer"
                >
                  <div
                    className="flex items-center "
                    onClick={() =>
                      router.push(`/school/teachers/${teacher.user.id}`)
                    }
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {teacher?.user?.firstName?.[0]}
                        {teacher?.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {`${teacher?.user?.firstName} ${teacher?.user?.lastName}`}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {teacher?.user?.email}
                      </p>
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
    </Card>
  );
}
