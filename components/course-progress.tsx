import { calcPercentage, cn } from "@/lib/utils";
import React from "react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface CourseProgressProps {
  attendedClasses: number;
  totalClasses: number;
  className?: string;
}

export default function CourseProgress({
  attendedClasses,
  totalClasses,
  className,
}: CourseProgressProps) {
  return (
    <div
      className={cn(
        "w-[180px] ml-auto col-span-2 flex justify-end gap-4",
        className
      )}
    >
      {attendedClasses === totalClasses ? (
        <Badge className="bg-green-600 hover:bg-green-600">Completed</Badge>
      ) : (
        <div className="w-[180px] flex flex-col gap-2">
          <p className="text-sm text-right font-semibold leading-none">
            {attendedClasses}/{totalClasses}
          </p>
          <Progress value={calcPercentage(attendedClasses, totalClasses)} />
        </div>
      )}
    </div>
  );
}
