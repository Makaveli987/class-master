import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Course } from "@prisma/client";
import React from "react";

interface StudentCoursesProps {
  courses: Course[];
}

function calcPercentage(x: number, y: number) {
  return (x / y) * 100;
}

export default function StudentCourses({ courses }: StudentCoursesProps) {
  if (!courses) {
    return <p className="text-sm">The student has not attended any courses.</p>;
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <span className="text-sm font-semibold leading-none">
          Engleski jezik A2
        </span>
        <div className="flex flex-col space-y-1 text-right">
          <p className="text-sm leading-none">Natasa Blagojevic</p>
          <p className="text-xs leading-none text-muted-foreground">Teacher</p>
        </div>
        <div className="w-[180px] flex justify-end">
          <Badge className="bg-green-600 hover:bg-green-600">Completed</Badge>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-start">
        <span className="text-sm font-semibold leading-none">
          Engleski jezik A2
        </span>
        <div className="flex flex-col space-y-1 text-right">
          <p className="text-sm leading-none">Natasa Blagojevic</p>
          <p className="text-xs leading-none text-muted-foreground">Teacher</p>
        </div>
        <div className="w-[180px] flex flex-col gap-2">
          <p className="text-sm text-right font-semibold leading-none">27/40</p>
          <Progress value={calcPercentage(27, 40)} />
        </div>
      </div>
    </div>
  );
}
