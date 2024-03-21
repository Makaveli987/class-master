"use client";
import { completeEnrollment } from "@/actions/enrollments/complete-enrollment";
import { CourseResponse } from "@/actions/get-courses";
import { EnrollmentResponse } from "@/actions/get-enrolments";
import CourseProgress from "@/components/course-progress";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  BasicInfoIcon,
  BasicInfoItem,
  BasicInfoLabel,
} from "@/components/user/basic-info-item";
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
  ShieldCheckIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EnrollmentDetailsProps {
  enrollment?: EnrollmentResponse;
  courses?: CourseResponse[];
}

export default function EnrollmentDetails({
  enrollment,
  courses,
}: EnrollmentDetailsProps) {
  const enrollDialog = useEnrollDialog();
  const router = useRouter();

  const [completed, setCompleted] = useState<boolean>(false);

  const [stausDisabled, setStatusDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (enrollment?.completed) {
      setCompleted(enrollment?.completed);
    }
  }, [enrollment]);

  async function onStatusChange(status: boolean) {
    await completeEnrollment(enrollment?.id as string, status)
      .then((response) => {
        if (response.error) {
          toast.error(response.error);
          setCompleted(enrollment?.completed as boolean);
        } else {
          toast.success(response.message);
          setCompleted(status);

          router.refresh();
        }
      })
      .catch(() =>
        toast.error("Something bad happend. Enrollment was not completed")
      )
      .finally(() => setStatusDisabled(false));
  }

  return (
    <div className="max-w-4xl pt-4 pb-6 px-6">
      <div className="flex justify-between">
        <h3 className="font-semibold">Basic Details</h3>
        <Button
          disabled={enrollment?.completed}
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

      <div className="flex flex-col gap-5 mt-4">
        <div className="flex">
          <div className="flex-1">
            <BasicInfoItem>
              <BasicInfoIcon>
                <GraduationCapIcon />
              </BasicInfoIcon>
              <BasicInfoLabel label="Teacher">
                {" "}
                {enrollment?.teacher?.firstName +
                  " " +
                  enrollment?.teacher?.lastName}
              </BasicInfoLabel>
            </BasicInfoItem>
          </div>
          <div className="flex-1">
            <BasicInfoItem>
              <BasicInfoIcon>
                <BookAIcon />
              </BasicInfoIcon>
              <BasicInfoLabel label="Course">
                {enrollment?.course?.name}
              </BasicInfoLabel>
            </BasicInfoItem>
          </div>
        </div>

        <div className="flex">
          <div className="flex-1">
            <BasicInfoItem>
              <BasicInfoIcon>
                <EuroIcon />
              </BasicInfoIcon>
              <BasicInfoLabel label="Price">
                {formatPrice(enrollment?.price as number)}
              </BasicInfoLabel>
            </BasicInfoItem>
          </div>
          {enrollment?.pricePerStudent && (
            <div className="flex-1">
              <BasicInfoItem>
                <BasicInfoIcon>
                  <CoinsIcon />
                </BasicInfoIcon>
                <BasicInfoLabel label="Price Per Student">
                  {formatPrice(enrollment?.pricePerStudent as number)}
                </BasicInfoLabel>
              </BasicInfoItem>
            </div>
          )}

          {!enrollment?.pricePerStudent && (
            <div className="flex-1">
              <BasicInfoItem>
                <BasicInfoIcon>
                  <BarChart3Icon />
                </BasicInfoIcon>
                <BasicInfoLabel label="Classes">
                  <CourseProgress
                    attendedClasses={enrollment?.attendedClasses || 0}
                    totalClasses={enrollment?.totalClasses || 0}
                    className="mt-1.5"
                    labelPosition="left"
                    completed={enrollment?.completed || false}
                  />
                </BasicInfoLabel>
              </BasicInfoItem>
            </div>
          )}
        </div>

        <div className="flex">
          <div className="flex-1">
            <BasicInfoItem className="items-start">
              <BasicInfoIcon>
                <ListChecksIcon />
              </BasicInfoIcon>
              <BasicInfoLabel label="Goals">
                <span className="font-medium whitespace-pre-wrap">
                  {enrollment?.courseGoals || "-"}
                </span>
              </BasicInfoLabel>
            </BasicInfoItem>
          </div>

          {enrollment?.pricePerStudent && (
            <div className="flex-1">
              <BasicInfoItem>
                <BasicInfoIcon>
                  <BarChart3Icon />
                </BasicInfoIcon>
                <BasicInfoLabel label="Classes">
                  <CourseProgress
                    attendedClasses={enrollment?.attendedClasses || 0}
                    totalClasses={enrollment?.totalClasses || 0}
                    className="mt-1.5"
                    labelPosition="left"
                    completed={enrollment?.completed || false}
                  />
                </BasicInfoLabel>
              </BasicInfoItem>
            </div>
          )}
        </div>
        <div className="flex">
          <div className="flex-1">
            <BasicInfoItem>
              <BasicInfoIcon>
                <ShieldCheckIcon />
              </BasicInfoIcon>
              <BasicInfoLabel label="Status">
                <div className="flex gap-2 items-center mt-1">
                  <Switch
                    disabled={stausDisabled}
                    checked={completed}
                    onCheckedChange={(val) => {
                      setStatusDisabled(true);
                      setCompleted(val);
                      onStatusChange(val);
                    }}
                    aria-readonly
                  />
                  <Label className="font-semibold">
                    {completed ? "Completed" : "In progress"}
                  </Label>
                </div>
              </BasicInfoLabel>
            </BasicInfoItem>
          </div>
        </div>
      </div>
    </div>
  );
}
