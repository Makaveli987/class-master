"use client";
import { Button } from "@/components/ui/button";
import { BasicInfoItem } from "@/components/user/basic-info-item";
import useStudentDialog from "@/hooks/use-student-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { formatDate } from "@/lib/utils";
import { Student } from "@prisma/client";
import { CalendarIcon, EditIcon, MailIcon, PhoneIcon } from "lucide-react";

interface StudenDetailsProps {
  student?: Student;
}

export default function StudenDetails({ student }: StudenDetailsProps) {
  const studentDialog = useStudentDialog();
  return (
    <div className="max-w-4xl pt-4 pb-6 px-6">
      <div className="flex justify-between">
        <h3 className="font-semibold">Basic Details</h3>
        {/* <CardTitle>Basic Details</CardTitle> */}
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
          value={formatDate(student?.dateOfBirth!, false)}
        />
      </div>
    </div>
  );
}
