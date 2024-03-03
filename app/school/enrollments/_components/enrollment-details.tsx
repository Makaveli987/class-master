"use client";
import { CourseResponse } from "@/actions/get-courses";
import { EnrollmentResponse } from "@/actions/get-enrolments";
import CourseProgress from "@/components/course-progress";

import { Button } from "@/components/ui/button";
import { BasicInfoItem } from "@/components/user/basic-info-item";
import useEnrollDialog, { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { formatPrice } from "@/lib/utils";
import {
  BarChart3Icon,
  BookAIcon,
  CoinsIcon,
  EditIcon,
  EuroIcon,
  GraduationCapIcon,
  ListChecksIcon,
  MailIcon,
} from "lucide-react";

interface EnrollmentDetailsProps {
  enrollment?: EnrollmentResponse;
  courses?: CourseResponse[];
}

export default function EnrollmentDetails({
  enrollment,
  courses,
}: EnrollmentDetailsProps) {
  const enrollDialog = useEnrollDialog();
  return (
    <div className="max-w-4xl pt-4 pb-6 px-6">
      <div className="flex justify-between">
        <h3 className="font-semibold">Basic Details</h3>
        {/* <CardTitle>Basic Details</CardTitle> */}
        <Button
          onClick={() =>
            enrollDialog.open({
              data: enrollment,
              action: DialogAction.EDIT,
              userType: enrollment?.studentId
                ? EnrollUserType.STUDENT
                : EnrollUserType.GROUP,
              userId: enrollment?.studentId
                ? enrollment.studentId
                : enrollment?.groupId,
              courses: courses,
            })
          }
          variant="outline"
        >
          <EditIcon className="w-4 h-4 mr-2" /> Edit
        </Button>
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-5 mt-4"> */}
      <div className="flex flex-col gap-5 mt-4">
        <div className="flex">
          <div className="flex-1">
            <BasicInfoItem
              icon={<GraduationCapIcon />}
              label="Teacher"
              value={
                enrollment?.teacher?.firstName +
                " " +
                enrollment?.teacher?.lastName
              }
            />
          </div>
          <div className="flex-1">
            <BasicInfoItem
              icon={<BookAIcon />}
              label="Course"
              value={enrollment?.course?.name}
            />
          </div>
        </div>

        <div className="flex">
          <div className="flex-1">
            <BasicInfoItem
              icon={<EuroIcon />}
              label="Price"
              value={formatPrice(enrollment?.price as number)}
            />
          </div>
          {enrollment?.pricePerStudent && (
            <div className="flex-1">
              <BasicInfoItem
                icon={<CoinsIcon />}
                label="Price Per Student"
                value={formatPrice(enrollment?.pricePerStudent as number)}
              />
            </div>
          )}

          {!enrollment?.pricePerStudent && (
            <div className="flex flex-1 items-start gap-3">
              <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
                <BarChart3Icon />
              </div>
              <div className="flex flex-col justify-start items-start text-sm mt-1.5">
                <span className="text-muted-foreground text-xs">Classes</span>
                <CourseProgress
                  attendedClasses={enrollment?.attendedClasses || 0}
                  totalClasses={enrollment?.totalClasses || 0}
                  className="mt-1.5"
                  labelPosition="left"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex">
          <div className="flex flex-1 items-start gap-3">
            <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
              <ListChecksIcon />
            </div>
            <div className="flex flex-col text-sm mt-1.5">
              <span className="text-muted-foreground text-xs">Goals</span>
              <span className="font-medium whitespace-pre-wrap">
                {enrollment?.courseGoals || "-"}
              </span>
            </div>
          </div>

          {enrollment?.pricePerStudent && (
            <div className="flex flex-1 items-start gap-3">
              <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
                <BarChart3Icon />
              </div>
              <div className="flex flex-col justify-start items-start text-sm mt-1.5">
                <span className="text-muted-foreground text-xs">Classes</span>
                <CourseProgress
                  attendedClasses={enrollment?.attendedClasses || 0}
                  totalClasses={enrollment?.totalClasses || 0}
                  className="mt-1.5"
                  labelPosition="left"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
