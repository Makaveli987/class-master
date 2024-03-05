"use client";
import { StudentGroupsResponse } from "@/actions/get-students";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import StatusBadge from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import {
  BasicInfoIcon,
  BasicInfoItem,
  BasicInfoLabel,
} from "@/components/user/basic-info-item";
import useStudentDialog from "@/hooks/use-student-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { formatPhoneNumber } from "@/lib/utils";
import { Student } from "@prisma/client";
import { format } from "date-fns";
import {
  CalendarIcon,
  EditIcon,
  MailIcon,
  PhoneIcon,
  UserRoundCheckIcon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";

interface StudentDetailsProps {
  student?: Student;
  studentGroups?: StudentGroupsResponse[];
}

export default function StudentDetails({
  student,
  studentGroups,
}: StudentDetailsProps) {
  const studentDialog = useStudentDialog();

  return (
    <div className="max-w-4xl pt-4 pb-6 px-6">
      <div className="flex justify-between">
        <h3 className="font-semibold text-base">Basic Details</h3>
        <Button
          onClick={() =>
            studentDialog.open({ data: student, action: DialogAction.EDIT })
          }
          variant="outline"
        >
          <EditIcon className="w-4 h-4 mr-2" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-5 mt-4">
        <BasicInfoItem>
          <BasicInfoIcon>
            <MailIcon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Email"> {student?.email}</BasicInfoLabel>
        </BasicInfoItem>

        <BasicInfoItem>
          <BasicInfoIcon>
            <PhoneIcon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Phone">
            {formatPhoneNumber(student?.phone as string)}
          </BasicInfoLabel>
        </BasicInfoItem>

        <BasicInfoItem>
          <BasicInfoIcon>
            <CalendarIcon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Date of Birth">
            {format(student?.dateOfBirth as Date, "dd-MMM-yyyy")}
          </BasicInfoLabel>
        </BasicInfoItem>

        <BasicInfoItem>
          <BasicInfoIcon>
            <Users2Icon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Groups">
            <div>
              {studentGroups?.length ? (
                studentGroups?.map((item, index) => (
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
                      {index + 1 === studentGroups.length ? null : ","}
                    </Link>
                  </Button>
                ))
              ) : (
                <span className="pl-1">-</span>
              )}
            </div>
          </BasicInfoLabel>
        </BasicInfoItem>

        <BasicInfoItem>
          <BasicInfoIcon>
            <UserRoundCheckIcon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Status">
            <StatusBadge
              className="mt-1 py-0 rounded-md"
              active={student?.active || false}
            />
          </BasicInfoLabel>
        </BasicInfoItem>
      </div>
    </div>
  );
}
