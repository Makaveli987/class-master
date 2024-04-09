"use client";
import { completeEnrollment } from "@/actions/enrollments/complete-enrollment";
import { CourseResponse } from "@/actions/get-courses";
import { EnrollmentResponse } from "@/actions/get-enrolments";
import CourseProgress from "@/components/course-progress";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MerakiBadge } from "@/components/ui/meraki-badge";
import useEnrollDialog, { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { formatPrice } from "@/lib/utils";
import axios from "axios";
import { format } from "date-fns";
import {
  BookAIcon,
  CheckCircle2Icon,
  CircleEllipsisIcon,
  CoinsIcon,
  EditIcon,
  EuroIcon,
  GraduationCapIcon,
  ListChecksIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const [isPending, setIsPending] = useState<boolean>(false);

  async function onStatusChange() {
    setIsPending(true);
    await completeEnrollment(enrollment?.id as string, !completed)
      .then((response) => {
        if (response.error) {
          toast.error(response.error);
          setCompleted(enrollment?.completed as boolean);
        } else {
          toast.success(response.message);
          setCompleted(response.data?.completed as boolean);

          router.refresh();
        }
      })
      .catch(() =>
        toast.error("Something bad happend. Enrollment was not completed")
      )
      .finally(() => setIsPending(false));
  }

  function onDelete() {
    axios
      .delete(`/api/enrollments/${enrollment?.id}`)
      .then(() => {
        toast.success("Enrollment has been archived");
        router.refresh();
      })
      .catch(() =>
        toast.error("Something bad happend. Enrollment has not been archived!")
      );
  }

  function getEnrollentUserIcon() {
    return enrollment?.studentId ? "male-student" : "group";
  }

  function getEnrollentUser() {
    return enrollment?.studentId
      ? `${enrollment.student?.firstName} ${enrollment.student?.lastName}`
      : `${enrollment?.group?.name}`;
  }

  return (
    // <div className="max-w-4xl pt-4 pb-6 px-6">
    //   <div className="flex justify-between">
    //     <h3 className="font-semibold">Basic Details</h3>
    //     <Button
    //       disabled={enrollment?.completed}
    //       onClick={() =>
    //         enrollDialog.open({
    //           data: enrollment,
    //           action: DialogAction.EDIT,
    //           userType: enrollment?.studentId
    //             ? EnrollUserType.STUDENT
    //             : EnrollUserType.GROUP,
    //           userId: enrollment?.studentId
    //             ? enrollment.studentId
    //             : enrollment?.groupId,
    //           courses: courses,
    //         })
    //       }
    //       variant="outline"
    //     >
    //       <EditIcon className="w-4 h-4 mr-2" /> Edit
    //     </Button>
    //   </div>

    //   <div className="flex flex-col gap-5 mt-4">
    //     <div className="flex">
    //       <div className="flex-1">
    //         <BasicInfoItem>
    //           <BasicInfoIcon>
    //             <GraduationCapIcon />
    //           </BasicInfoIcon>
    //           <BasicInfoLabel label="Teacher">
    //             {" "}
    //             {enrollment?.teacher?.firstName +
    //               " " +
    //               enrollment?.teacher?.lastName}
    //           </BasicInfoLabel>
    //         </BasicInfoItem>
    //       </div>
    //       <div className="flex-1">
    //         <BasicInfoItem>
    //           <BasicInfoIcon>
    //             <BookAIcon />
    //           </BasicInfoIcon>
    //           <BasicInfoLabel label="Course">
    //             {enrollment?.course?.name}
    //           </BasicInfoLabel>
    //         </BasicInfoItem>
    //       </div>
    //     </div>

    //     <div className="flex">
    //       <div className="flex-1">
    //         <BasicInfoItem>
    //           <BasicInfoIcon>
    //             <EuroIcon />
    //           </BasicInfoIcon>
    //           <BasicInfoLabel label="Price">
    //             {formatPrice(enrollment?.price as number)}
    //           </BasicInfoLabel>
    //         </BasicInfoItem>
    //       </div>
    //       {enrollment?.pricePerStudent && (
    //         <div className="flex-1">
    //           <BasicInfoItem>
    //             <BasicInfoIcon>
    //               <CoinsIcon />
    //             </BasicInfoIcon>
    //             <BasicInfoLabel label="Price Per Student">
    //               {formatPrice(enrollment?.pricePerStudent as number)}
    //             </BasicInfoLabel>
    //           </BasicInfoItem>
    //         </div>
    //       )}

    //       {!enrollment?.pricePerStudent && (
    //         <div className="flex-1">
    //           <BasicInfoItem>
    //             <BasicInfoIcon>
    //               <BarChart3Icon />
    //             </BasicInfoIcon>
    //             <BasicInfoLabel label="Classes">
    //               <CourseProgress
    //                 attendedClasses={enrollment?.attendedClasses || 0}
    //                 totalClasses={enrollment?.totalClasses || 0}
    //                 className="mt-1.5"
    //                 labelPosition="left"
    //                 completed={enrollment?.completed || false}
    //               />
    //             </BasicInfoLabel>
    //           </BasicInfoItem>
    //         </div>
    //       )}
    //     </div>

    //     <div className="flex">
    //       <div className="flex-1">
    //         <BasicInfoItem className="items-start">
    //           <BasicInfoIcon>
    //             <ListChecksIcon />
    //           </BasicInfoIcon>
    //           <BasicInfoLabel label="Goals">
    //             <span className="font-medium whitespace-pre-wrap">
    //               {enrollment?.courseGoals || "-"}
    //             </span>
    //           </BasicInfoLabel>
    //         </BasicInfoItem>
    //       </div>

    //       {enrollment?.pricePerStudent && (
    //         <div className="flex-1">
    //           <BasicInfoItem>
    //             <BasicInfoIcon>
    //               <BarChart3Icon />
    //             </BasicInfoIcon>
    //             <BasicInfoLabel label="Classes">
    //               <CourseProgress
    //                 attendedClasses={enrollment?.attendedClasses || 0}
    //                 totalClasses={enrollment?.totalClasses || 0}
    //                 className="mt-1.5"
    //                 labelPosition="left"
    //                 completed={enrollment?.completed || false}
    //               />
    //             </BasicInfoLabel>
    //           </BasicInfoItem>
    //         </div>
    //       )}
    //     </div>
    //     <div className="flex">
    //       <div className="flex-1">
    //         <BasicInfoItem>
    //           <BasicInfoIcon>
    //             <ShieldCheckIcon />
    //           </BasicInfoIcon>
    //           <BasicInfoLabel label="Status">
    //             <div className="flex gap-2 items-center mt-1">
    //               <Switch
    //                 disabled={stausDisabled}
    //                 checked={completed}
    //                 onCheckedChange={(val) => {
    //                   setStatusDisabled(true);
    //                   setCompleted(val);
    //                   onStatusChange(val);
    //                 }}
    //                 aria-readonly
    //               />
    //               <Label className="font-semibold">
    //                 {completed ? "Completed" : "In progress"}
    //               </Label>
    //             </div>
    //           </BasicInfoLabel>
    //         </BasicInfoItem>
    //       </div>
    //     </div>
    //   </div>
    // </div>

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

      <div className="mt-1 flex items-center gap-3">
        <div className="flex size-4 items-center justify-center rounded-full">
          <EuroIcon />
        </div>
        <span className="font-semibold text-sm">
          {formatPrice(enrollment?.price as number)}
        </span>
      </div>

      {enrollment?.pricePerStudent && (
        <div className="mt-1 flex items-center gap-3">
          <div className="flex size-4 items-center justify-center rounded-full">
            <CoinsIcon />
          </div>
          <span className="font-semibold text-sm">
            {formatPrice(enrollment?.pricePerStudent as number)} / per student
          </span>
        </div>
      )}

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

      <div className="mt-6 flex gap-3">
        <ConfirmDialog
          description="This action will archive the student. You will not be able to assign students and classes to this student."
          onConfirm={onDelete}
        >
          <Button
            variant={"outline"}
            className="flex-1 hover:bg-destructive/5 hover:text-destructive hover:border-destructive"
          >
            <Trash2Icon className="size-4 mr-2" />
            Delete
          </Button>
        </ConfirmDialog>
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
          variant={"outline"}
          className="flex-1 hover:bg-primary/5 hover:text-primary hover:border-primary"
        >
          <EditIcon className="w-4 h-4 mr-2" /> Edit
        </Button>
      </div>

      <Button
        variant={completed ? "pink" : "emerald"}
        disabled={isPending}
        onClick={onStatusChange}
      >
        {isPending ? (
          <>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            {completed ? "Uncompleting Course" : "Completing Course"}
          </>
        ) : completed ? (
          "Uncomplete Course"
        ) : (
          "Complete Course"
        )}
      </Button>
    </div>
  );
}
