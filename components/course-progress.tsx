import { calcPercentage, cn } from "@/lib/utils";
import React from "react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface CourseProgressProps {
  attendedClasses: number;
  totalClasses: number;
  className?: string;
  labelPosition?: "left" | "right";
}

export default function CourseProgress({
  attendedClasses,
  totalClasses,
  className,
  labelPosition = "right",
}: CourseProgressProps) {
  return (
    <div
      className={cn(
        "w-[180px] col-span-2 flex justify-end gap-4",
        labelPosition === "left" ? "ml-auto" : "",
        className
      )}
    >
      {attendedClasses === totalClasses ? (
        <Badge className="bg-green-600 hover:bg-green-600">Completed</Badge>
      ) : (
        <div className="w-[180px] flex flex-col gap-2">
          <p
            className={cn(
              "text-sm font-semibold leading-none",
              labelPosition === "left" ? "text-left" : "text-right"
            )}
          >
            {attendedClasses}/{totalClasses}
          </p>
          <Progress value={calcPercentage(attendedClasses, totalClasses)} />
        </div>
      )}
    </div>
  );
}
