"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import StatusBadge from "@/components/ui/status-badge";
import {
  BasicInfoIcon,
  BasicInfoItem,
  BasicInfoLabel,
} from "@/components/user/basic-info-item";
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
  UserRoundCheckIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface TeacherDetailsProps {
  teacher?: User;
}

export default function TeacherDetails({ teacher }: TeacherDetailsProps) {
  const [newPassword, setNewPassword] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const teacherDialog = useTeacherDialog();
  const router = useRouter();

  function handleResetPassword() {
    axios
      .patch("/api/auth/register/reset-password", {
        teacherId: teacher?.id,
        password: newPassword,
      })
      .then((response) => {
        if (response.status === 200) {
          router.refresh();
          toast.success("Password has been reset.", {
            description: `${teacher?.firstName} ${teacher?.lastName}`,
          });
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Password has not been reset.", {
          description: `${teacher?.firstName} ${teacherDialog.data?.lastName}`,
        });
      })
      .finally(() => {
        setPending(false);
      });
    setNewPassword("");
    setIsPopoverOpen(false);
  }

  return (
    <div className="max-w-4xl pt-4 pb-6 px-6">
      <div className="flex justify-between">
        <h3 className="font-semibold">Basic Details</h3>
        <Button
          onClick={() =>
            teacherDialog.open({ data: teacher, action: DialogAction.EDIT })
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
          <BasicInfoLabel label="Email"> {teacher?.email}</BasicInfoLabel>
        </BasicInfoItem>

        <BasicInfoItem>
          <BasicInfoIcon>
            <PhoneIcon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Phone">
            {formatPhoneNumber(teacher?.phone as string)}
          </BasicInfoLabel>
        </BasicInfoItem>

        <BasicInfoItem>
          <BasicInfoIcon>
            <CalendarIcon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Date of Birth">
            {format(teacher?.dateOfBirth as Date, "dd-MMM-yyyy")}
          </BasicInfoLabel>
        </BasicInfoItem>

        <BasicInfoItem>
          <BasicInfoIcon>
            <CircleUserIcon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Role">{teacher?.role}</BasicInfoLabel>
        </BasicInfoItem>

        <BasicInfoItem>
          <BasicInfoIcon>
            <UserRoundCheckIcon />
          </BasicInfoIcon>
          <BasicInfoLabel label="Status">
            <StatusBadge className="mt-1" active={teacher?.active || false} />
          </BasicInfoLabel>
        </BasicInfoItem>
      </div>
      <Popover
        open={isPopoverOpen}
        onOpenChange={() => setIsPopoverOpen((current) => !current)}
      >
        <PopoverTrigger asChild>
          <Button className="mr-auto mt-8" disabled={pending} variant="link">
            Reset Password
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <p className="pb-2 text-sm font-medium">New Password</p>
          <Input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="Enter new password..."
          ></Input>
          <div className="flex justify-end mt-4">
            <Button className="ml-auto" onClick={handleResetPassword}>
              Reset
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
