"use client";
import { StudentGroupsResponse } from "@/actions/get-students";
import { Button } from "@/components/ui/button";
import { BasicInfoItem } from "@/components/user/basic-info-item";
import useStudentDialog from "@/hooks/use-student-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { formatDate } from "@/lib/utils";
import { Student } from "@prisma/client";
import { format } from "date-fns";
import {
  CalendarIcon,
  EditIcon,
  MailIcon,
  PhoneIcon,
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
        <BasicInfoItem
          icon={<MailIcon />}
          label="Email"
          value={student?.email}
        />
        <BasicInfoItem
          icon={<PhoneIcon />}
          label="Phone"
          value={student?.phone}
        />
        <BasicInfoItem
          icon={<CalendarIcon />}
          label="Date of Birth"
          value={format(student?.dateOfBirth as Date, "dd-MMM-yyyy")}
        />

        <div className="flex items-center gap-3">
          <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
            <Users2Icon />
          </div>
          <div className="flex flex-col text-sm">
            <span className="text-muted-foreground text-xs">Groups</span>
            <div>
              {studentGroups?.length ? (
                studentGroups?.map((item, index) => (
                  <Button
                    className="px-0 mr-1"
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
          </div>
        </div>
      </div>
    </div>
  );
}
