"use client";
import { Button } from "@/components/ui/button";
import useStudentDialog from "@/hooks/use-student-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { formatDate } from "@/lib/utils";
import { Student } from "@prisma/client";
import {
  EditIcon,
  CalendarIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import React from "react";

interface StudenDetailsProps {
  student?: Student;
}

export default function StudenDetails({ student }: StudenDetailsProps) {
  const studentDialog = useStudentDialog();
  return (
    <div className="max-w-4xl py-4 px-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Basic Details</h3>
        {/* <CardTitle>Basic Details</CardTitle> */}
        <Button
          onClick={() => {
            console.log("clicked");

            studentDialog.open({ data: student, action: DialogAction.EDIT });
          }}
          variant="outline"
        >
          <EditIcon className="w-4 h-4 mr-2" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-5 mt-4">
        <div className="flex items-center gap-3 text-sm">
          <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
            <CalendarIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Date of Birth</span>
            <span className="font-medium">
              {formatDate(student?.dateOfBirth!, false)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
            <UserIcon />
          </div>
          <div className="flex flex-col text-sm">
            <span className="text-muted-foreground text-xs">Gender</span>
            <span className="font-medium">{student?.gender}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
            <MailIcon />
          </div>
          <div className="flex flex-col text-sm">
            <span className="text-muted-foreground text-xs">Email</span>
            <span className="font-medium">{student?.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
            <PhoneIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Phone</span>
            <span className="font-medium">{student?.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
