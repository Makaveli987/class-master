"use client";
import { CourseResponse } from "@/actions/get-courses";
import { EnrollmentResponse } from "@/actions/get-enrolments";
import CourseProgress from "@/components/course-progress";

import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import {
  BookAIcon,
  CoinsIcon,
  EuroIcon,
  GraduationCapIcon,
  ListChecksIcon,
} from "lucide-react";
import Image from "next/image";

interface EnrollmentDetailsProps {
  enrollment?: EnrollmentResponse;
  courses?: CourseResponse[];
}

export default function EnrollmentDetails({
  enrollment,
  courses,
}: EnrollmentDetailsProps) {
  function getEnrollentUserIcon() {
    return enrollment?.studentId ? "male-student" : "group";
  }

  function getEnrollentUser() {
    return enrollment?.studentId
      ? `${enrollment.student?.firstName} ${enrollment.student?.lastName}`
      : `${enrollment?.group?.name}`;
  }

  return (
    <div className="flex min-w-60 max-w-80 flex-col gap-3 border-r py-6 px-8">
      <div className="">
        <div className="mx-auto size-20 rounded-full bg-muted text-center relative">
          <Image
            src={`/${getEnrollentUserIcon()}.png`}
            alt={"Student Image"}
            fill
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col justify-center text-center mt-3 pb-6 border-b">
          <h2 className="text-xl font-bold tracking-tight">
            {getEnrollentUser()}
          </h2>
          <p className="text-muted-foreground text-sm">
            Enrolled:{" "}
            {format(enrollment?.createdAt as Date, "dd-MMM-yyyy") || "-"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex size-4 items-center justify-center rounded-full">
          <GraduationCapIcon />
        </div>
        <div className="flex flex-col text-sm">
          <span className="font-semibold">
            {enrollment?.teacher?.firstName +
              " " +
              enrollment?.teacher?.lastName}
          </span>
        </div>
      </div>

      <div className="mt-1 flex items-center gap-3">
        <div className="flex size-4 items-center justify-center rounded-full">
          <BookAIcon />
        </div>
        <span className="font-semibold text-sm">
          {enrollment?.course?.name}
        </span>
      </div>

      <div className="mt-1 flex items-start gap-3">
        <div className="flex size-4 items-center justify-center rounded-full">
          <ListChecksIcon />
        </div>
        <div className="font-semibold flex flex-col items-start justify-start gap-2">
          <span className="text-sm whitespace-pre-wrap">
            {enrollment?.courseGoals || "-"}
          </span>
        </div>
      </div>

      <CourseProgress
        className="mt-2"
        attendedClasses={enrollment?.attendedClasses as number}
        totalClasses={enrollment?.totalClasses as number}
        completed={enrollment?.completed as boolean}
      />
    </div>
  );
}
