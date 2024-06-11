"use client";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import StatusBadge from "@/components/ui/status-badge";
import useTeacherDialog from "@/hooks/use-teacher-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { formatPhoneNumber } from "@/lib/utils";
import { User } from "@prisma/client";
import axios from "axios";
import { format } from "date-fns";
import {
  CalendarIcon,
  CircleUserIcon,
  EditIcon,
  MailIcon,
  PhoneIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TeacherDetailsProps {
  teacher?: User;
}

export default function TeacherDetails({ teacher }: TeacherDetailsProps) {
  const teacherDialog = useTeacherDialog();
  const router = useRouter();

  function onDelete() {
    axios
      .delete(`/api/auth/register/teachers/${teacher?.id}`)
      .then(() => {
        toast.success("Teacher has been archived");
        router.refresh();
      })
      .catch(() =>
        toast.error("Something bad happend. Teacher has not been archived!")
      );
  }

  return (
    <div className="flex min-w-60 max-w-80 flex-col gap-3 border-r py-6 px-8">
      <div>
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
            {teacher?.firstName + " " + teacher?.lastName}
          </h2>
          <p className="text-muted-foreground text-sm">
            Created: {format(teacher?.createdAt as Date, "dd-MMM-yyyy") || "-"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex size-4 items-center justify-center rounded-full">
          <MailIcon />
        </div>
        <div className="flex flex-col text-sm">
          <span className="">{teacher?.email}</span>
        </div>
      </div>

      <div className="mt-1 flex items-center gap-3">
        <div className="flex size-4 items-center justify-center rounded-full">
          <PhoneIcon />
        </div>
        <span className=" text-sm">
          {formatPhoneNumber(teacher?.phone as string)}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-3">
        <div className="flex size-4 items-center justify-center rounded-full">
          <CalendarIcon />
        </div>
        <span className=" text-sm">
          {teacher?.dateOfBirth
            ? format(teacher?.dateOfBirth as Date, "dd-MMM-yyyy")
            : "-"}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-3">
        <div className="flex size-4 items-center justify-center rounded-full">
          <CircleUserIcon />
        </div>
        <span className=" text-sm">{teacher?.role}</span>
      </div>

      <StatusBadge
        className="mt-4 justify-center h-7"
        active={teacher?.active || false}
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
            <Trash2Icon className="size-3.5 mr-2" />
            Delete
          </Button>
        </ConfirmDialog>
        <Button
          size={"sm"}
          variant={"outline"}
          className="flex-1 hover:bg-primary/5 hover:text-primary hover:border-primary"
          onClick={() =>
            teacherDialog.open({ data: teacher, action: DialogAction.EDIT })
          }
        >
          <EditIcon className="size-3.5 mr-2" />
          Edit
        </Button>
      </div>
    </div>
  );
}
