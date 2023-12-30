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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { Course, User } from "@prisma/client";
import { PlusCircleIcon, XIcon } from "lucide-react";
import React from "react";

interface CourseTeachersCardProps {
  teacherId: string;
  courses?: Course[] | null;
}

export default function AssignedCoursesCard({
  teacherId,
  courses,
}: CourseTeachersCardProps) {
  function handleComfirm() {
    console.log({ teacherId });
  }

  return (
    <Card className="flex-1 h-[608px]">
      <CardHeader className="mb-3 relative max-w-[348px]">
        <CardTitle>Courses</CardTitle>
        <CardDescription>Courses that the teacher can teach</CardDescription>
        <Tooltip2 text="Assign course">
          <Button className="absolute right-0 top-4" variant="ghost">
            <PlusCircleIcon className="w-5 h-5" />
          </Button>
        </Tooltip2>
      </CardHeader>
      <CardContent>
        {courses?.length === 0 ? (
          <p className="text-sm">
            There are no courses assigned to this teacher.
          </p>
        ) : (
          <ScrollArea type="always" className="h-[400px]">
            <div className="">
              <div className="flex items-center justify-between hover:bg-muted rounded-lg p-2 h-12 max-w-[330px] group">
                <div className="flex items-center ">
                  <div className="ml-4 ">
                    <p className="text-sm font-medium leading-none">
                      Engleski jezik A1
                    </p>
                  </div>
                </div>

                <ConfirmDialog
                  description={
                    "This action will remove teacher from this course. You will not be able to assign students to this course with this teacher."
                  }
                  onConfirm={handleComfirm}
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
              <div className="flex items-center justify-between hover:bg-muted rounded-lg p-2 h-12 max-w-[330px] group">
                <div className="flex items-center ">
                  <div className="ml-4">
                    <p className="text-sm font-medium leading-none">
                      Engleski jezik A1
                    </p>
                  </div>
                </div>
                <Tooltip2 text="Unassign course">
                  <Button variant="ghost" className="hidden group-hover:block">
                    <XIcon className="w-4 h-4" />
                  </Button>
                </Tooltip2>
              </div>
              <div className="flex items-center justify-between hover:bg-muted rounded-lg p-2 h-12 max-w-[330px] group">
                <div className="flex items-center ">
                  <div className="ml-4">
                    <p className="text-sm font-medium leading-none">
                      Engleski jezik A1
                    </p>
                  </div>
                </div>
                <Tooltip2 text="Unassign course">
                  <Button variant="ghost" className="hidden group-hover:block">
                    <XIcon className="w-4 h-4" />
                  </Button>
                </Tooltip2>
              </div>
              <div className="flex items-center justify-between hover:bg-muted rounded-lg p-2 h-12 max-w-[330px] group">
                <div className="flex items-center ">
                  <div className="ml-4">
                    <p className="text-sm font-medium leading-none">
                      Engleski jezik A1
                    </p>
                  </div>
                </div>
                <Tooltip2 text="Unassign course">
                  <Button variant="ghost" className="hidden group-hover:block">
                    <XIcon className="w-4 h-4" />
                  </Button>
                </Tooltip2>
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
