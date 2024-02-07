"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useClassDetailsDialog } from "@/hooks/use-class-details-dialog";
import { ClassStatus } from "@/lib/models/class-status";
import { zodResolver } from "@hookform/resolvers/zod";
import { Enrollment } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import {
  BookAIcon,
  CalendarCheck2Icon,
  GraduationCap,
  Loader2Icon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { formatDate, getTimeFromDate } from "@/lib/utils";
import { format } from "date-fns";
import StudentClassForm from "./student-class-form";
import { useEffect, useState } from "react";
import { GroupStudentsResponse } from "@/app/api/groups/[groupId]/students/route";
import GroupClassForm from "./group-class-form";
import LinearLoader from "@/components/ui/linear-loader";

const formSchema = z.object({
  description: z.string(),
  note: z.string(),
  classStatus: z.string(),
});

export default function ClassDetailsDialog() {
  const [students, setStudents] = useState<GroupStudentsResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const classDetailsDialog = useClassDetailsDialog();
  const router = useRouter();

  useEffect(() => {
    if (classDetailsDialog.data?.id) {
      console.log("classDetailsDialog.data :>> ", classDetailsDialog.data);
      if (classDetailsDialog.data.group?.id) {
        setIsLoading(true);
        // TODO: This should be fetched from attendece table
        axios
          .get(`/api/groups/${classDetailsDialog.data.group.id}/students`)
          .then((response: AxiosResponse<GroupStudentsResponse[]>) => {
            console.log("response :>> ", response.data);
            setStudents(response.data);
          })
          .catch((error) => {
            toast.error("Something went wrong. Classroom wasn't added!");
          })
          .finally(() => setIsLoading(false));
      }
    }
  }, [classDetailsDialog.data]);

  return (
    <Dialog
      open={classDetailsDialog.isOpen}
      onOpenChange={() => {
        if (classDetailsDialog.isOpen) {
          classDetailsDialog.close();
        }
      }}
    >
      <DialogContent className="max-w-[650px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Class Details</DialogTitle>
        </DialogHeader>

        {/* <div className=" max-h-96 overflow-auto"> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-3 gap-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
              <UserIcon />
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-muted-foreground text-xs">
                {classDetailsDialog.data?.studentId ? "Student" : "Group"}
              </span>
              <span className="font-medium">
                {classDetailsDialog.data?.studentId
                  ? `${classDetailsDialog.data?.student?.firstName} ${classDetailsDialog.data?.student?.lastName}`
                  : `${classDetailsDialog.data?.group.name}`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
              <GraduationCap />
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-muted-foreground text-xs">Teacher</span>
              {classDetailsDialog.data?.substituteTeacherId ? (
                <span className="font-medium">{`${classDetailsDialog.data?.substituteTeacher?.firstName} ${classDetailsDialog.data?.substituteTeacher?.lastName}`}</span>
              ) : (
                <span className="font-medium">{`${classDetailsDialog.data?.originalTeacher?.firstName} ${classDetailsDialog.data?.originalTeacher?.lastName}`}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
              <CalendarCheck2Icon />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Date</span>
              <div className="flex gap-4 font-medium text-sm">
                <span className="font-medium">
                  {classDetailsDialog.data?.start &&
                    format(
                      classDetailsDialog.data?.start as Date,
                      "dd-MMM-yyyy"
                    )}
                </span>
                <span className="font-medium">
                  {getTimeFromDate(classDetailsDialog.data?.start as Date)} -{" "}
                  {getTimeFromDate(classDetailsDialog.data?.end as Date)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
              <BookAIcon />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Course</span>
              <span className="font-medium">
                {classDetailsDialog.data?.course.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
              <BookAIcon />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Classroom</span>
              <span className="font-medium">
                {classDetailsDialog.data?.classroom.name}
              </span>
            </div>
          </div>
        </div>

        <Separator className="mt-2 mb-1" />

        {classDetailsDialog.data?.studentId ? (
          <StudentClassForm />
        ) : (
          <GroupClassForm students={students} isLoading={isLoading} />
        )}
        {/* </div> */}
      </DialogContent>
    </Dialog>
  );
}
