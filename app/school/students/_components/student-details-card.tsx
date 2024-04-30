"use client";
import { StudentGroupsResponse } from "@/actions/get-students";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import StatusBadge from "@/components/ui/status-badge";
import useStudentDialog from "@/hooks/use-student-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { formatPhoneNumber } from "@/lib/utils";
import { Student } from "@prisma/client";
import axios from "axios";
import { format } from "date-fns";
import {
  CalendarIcon,
  EditIcon,
  MailIcon,
  PhoneIcon,
  Trash2Icon,
  Users2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StudentDetailsProps {
  student?: Student;
  studentGroups?: StudentGroupsResponse[];
}

export default function StudentDetails({
  student,
  studentGroups,
}: StudentDetailsProps) {
  const studentDialog = useStudentDialog();
  const router = useRouter();

  function onDelete() {
    axios
      .delete(`/api/students/${student?.id}`)
      .then(() => {
        toast.success("Student has been archived");
        router.refresh();
      })
      .catch(() =>
        toast.error("Something bad happend. Group has not been archived!")
      );
  }

  return (
    <div className="flex min-w-60 max-w-80 flex-col gap-3 border-r py-6 px-8">
      <div className="">
        <div className="mx-auto size-20 rounded-full bg-muted text-center relative">
          <Image
            src="/male-student.png"
            alt={"Student Image"}
            fill
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col justify-center text-center mt-3 pb-6 border-b">
          <h2 className="text-xl font-bold tracking-tight">
            {student?.firstName + " " + student?.lastName}
          </h2>
          <p className="text-muted-foreground text-sm">
            Created: {format(student?.createdAt as Date, "dd-MMM-yyyy") || "-"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex size-4 items-center justify-center rounded-full">
          <MailIcon />
        </div>
        <div className="flex flex-col text-sm">
          <span className="font-semibold">{student?.email}</span>
        </div>
      </div>

      <div className="mt-1 flex items-center gap-3">
        <div className="flex size-4 items-center justify-center rounded-full">
          <PhoneIcon />
        </div>
        <span className="font-semibold text-sm">
          {formatPhoneNumber(student?.phone as string)}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-3">
        <div className="flex size-4 items-center justify-center rounded-full">
          <CalendarIcon />
        </div>
        <span className="font-semibold text-sm">
          {student?.dateOfBirth
            ? format(student?.dateOfBirth as Date, "dd-MMM-yyyy")
            : "-"}
        </span>
      </div>

      <div className="mt-1 flex items-start gap-3">
        <div className="flex size-4 items-center justify-center rounded-full">
          <Users2Icon />
        </div>
        <div className="font-semibold flex flex-col items-start justify-start gap-2">
          {studentGroups?.length ? (
            studentGroups?.map((item) => (
              <Button
                className="px-0 mr-1 py-0 h-4"
                key={item.group.name}
                asChild
                variant={"link"}
              >
                <Link
                  href={`/school/groups/${item.group.id}`}
                  className="font-medium cursor-pointer hover:underline-offset-1"
                >
                  {item.group.name}
                </Link>
              </Button>
            ))
          ) : (
            <span className="pl-1">-</span>
          )}
        </div>
      </div>

      <StatusBadge
        className="mt-4 justify-center h-7"
        active={student?.active || false}
      />

      <div className="mt-4 flex gap-3">
        <ConfirmDialog
          description="This action will archive the student. You will not be able to assign students and classes to this student."
          onConfirm={onDelete}
        >
          <Button
            size={"sm"}
            variant={"outline"}
            className="flex-1 hover:bg-destructive/5 hover:text-destructive hover:border-destructive"
          >
            <Trash2Icon className="size-4 mr-2" />
            Delete
          </Button>
        </ConfirmDialog>
        <Button
          size={"sm"}
          variant={"outline"}
          className="flex-1 hover:bg-primary/5 hover:text-primary hover:border-primary"
          onClick={() =>
            studentDialog.open({ data: student, action: DialogAction.EDIT })
          }
        >
          <EditIcon className="size-4 mr-2" />
          Edit
        </Button>
      </div>
    </div>
  );
}
