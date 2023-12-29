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
import { User } from "@prisma/client";
import { PlusCircleIcon, XIcon } from "lucide-react";
import React from "react";

interface CourseTeachersCardProps {
  courseId: string;
  teachers: User[] | null;
}

export default function CourseTeachersCard({
  courseId,
  teachers,
}: CourseTeachersCardProps) {
  function handleComfirm() {
    console.log({ courseId });
  }

  return (
    <Card className="flex-1 h-[524px]">
      <CardHeader className="mb-3 relative max-w-[348px]">
        <CardTitle>Teachers</CardTitle>
        <CardDescription>Teachers assigned to this course</CardDescription>
        <Tooltip2 text="Assign teacher">
          <Button className="absolute right-0 top-4" variant="ghost">
            <PlusCircleIcon className="w-5 h-5" />
          </Button>
        </Tooltip2>
      </CardHeader>
      <CardContent>
        {teachers?.length === 0 ? (
          <p className="text-sm">
            There are no teachers assigned to this course.
          </p>
        ) : (
          <ScrollArea type="always" className="h-[400px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between hover:bg-muted rounded-lg p-2 max-w-[330px] group">
                <div className="flex items-center ">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
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
              <div className="flex items-center justify-between hover:bg-muted rounded-lg p-2 max-w-[330px] group">
                <div className="flex items-center ">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p>
                  </div>
                </div>
                <Tooltip2 text="Unassign teacher">
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
