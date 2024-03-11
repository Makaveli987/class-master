import { calcPercentage, cn } from "@/lib/utils";
import React from "react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { MerakiBadge } from "./ui/meraki-badge";
import { CheckCircleIcon } from "lucide-react";

interface CourseProgressProps {
  attendedClasses: number;
  totalClasses: number;
  className?: string;
  labelPosition?: "left" | "right";
  completed: boolean;
}

export default function CourseProgress({
  attendedClasses,
  totalClasses,
  className,
  labelPosition = "right",
  completed,
}: CourseProgressProps) {
  return (
    <div
      className={cn(
        "w-[180px] col-span-2 flex gap-4",
        labelPosition === "left" ? "ml-auto" : "",
        // completed ? "justify-start" : "justify-end",
        className
      )}
    >
      {/* {completed ? (
        <MerakiBadge variant={"emerald"}>
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Completed
        </MerakiBadge>
      ) : ( */}
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
      {/* )} */}
    </div>
  );
}
