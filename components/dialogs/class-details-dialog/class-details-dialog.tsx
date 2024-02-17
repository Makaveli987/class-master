"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useClassDetailsDialog } from "@/hooks/use-class-details-dialog";
import { getTimeFromDate } from "@/lib/utils";
import axios, { AxiosResponse } from "axios";
import { format } from "date-fns";
import {
  BookAIcon,
  CalendarCheck2Icon,
  GraduationCap,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import GroupClassForm from "./group-class-form";
import StudentClassForm from "./student-class-form";
import { AttendanceResponse } from "@/app/api/attendance/class/[schoolClassId]/route";
import { NoteResponse } from "@/app/api/notes/class/[schoolClassId]/route";

export default function ClassDetailsDialog() {
  const [attendance, setAttendance] = useState<AttendanceResponse[]>([]);
  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const classDetailsDialog = useClassDetailsDialog();
  const router = useRouter();

  const getAttendance = useCallback(() => {
    axios
      .get(`/api/attendance/class/${classDetailsDialog?.data?.id}`)
      .then((response: AxiosResponse<AttendanceResponse[]>) => {
        console.log("response :>> ", response.data);
        setAttendance(response.data);
      })
      .catch((error) => {
        toast.error("Something went wrong. Classroom wasn't added!");
      })
      .finally(() => setIsLoading(false));
  }, [classDetailsDialog?.data?.id]);

  const getNotes = useCallback(() => {
    axios
      .get(`/api/notes/class/${classDetailsDialog?.data?.id}`)
      .then((response: AxiosResponse<NoteResponse[]>) => {
        console.log("notes :>> ", response.data);
        setNotes(response.data);
      })
      .catch((error) => {
        toast.error("Something went wrong. Classroom wasn't added!");
      })
      .finally(() => setIsLoading(false));
  }, [classDetailsDialog?.data?.id]);

  useEffect(() => {
    if (classDetailsDialog.data?.id) {
      console.log("classDetailsDialog.data :>> ", classDetailsDialog.data);
      if (classDetailsDialog.data.group?.id) {
        setIsLoading(true);
        getAttendance();
      }
      getNotes();
    }
  }, [classDetailsDialog.data, getAttendance, getNotes]);

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
              <span className="font-medium">{`${classDetailsDialog.data?.teacher?.firstName} ${classDetailsDialog.data?.teacher?.lastName}`}</span>
              {classDetailsDialog.data?.substitutedTeacherId && (
                <span className="text-muted-foreground text-xs">
                  Substitute for{" "}
                  {`${classDetailsDialog.data?.substitutedTeacher?.firstName} ${classDetailsDialog.data?.substitutedTeacher?.lastName}`}
                </span>
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
                {classDetailsDialog.data?.enrollment.course.name}
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
          <StudentClassForm notes={notes} />
        ) : (
          <GroupClassForm
            attendance={attendance}
            notes={notes}
            isLoading={isLoading}
          />
        )}
        {/* </div> */}
      </DialogContent>
    </Dialog>
  );
}
