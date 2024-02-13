"use client";
import { AttendanceResponse } from "@/app/api/attendance/class/[schoolClassId]/route";
import {
  AttendancePayload,
  UpdateClassGroupPayload,
} from "@/app/api/classes/group/[schoolClassId]/route";
import { NoteResponse } from "@/app/api/notes/class/[schoolClassId]/route";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Loader from "@/components/ui/page-loader";
import { Textarea } from "@/components/ui/textarea";
import { useClassDetailsDialog } from "@/hooks/use-class-details-dialog";
import { ClassStatus } from "@prisma/client";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface GroupClassFormProps {
  attendance: AttendanceResponse[];
  notes: NoteResponse[];
  isLoading: boolean;
}

type FormValues = {
  description: string;
  classStatus: ClassStatus;
  attendees: AttendancePayload[];
};

export default function GroupClassForm({
  attendance,
  notes,
  isLoading,
}: GroupClassFormProps) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const classDetailsDialog = useClassDetailsDialog();
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: {
      description: classDetailsDialog.data?.description || "",
      classStatus: classDetailsDialog.data?.schoolClassStatus,
      attendees: [
        {
          attendanceId: "",
          studentId: "1",
          attended: false,
          noteContent: "",
          noteId: "",
        },
      ],
    },
  });

  const { fields: attendees, update: updateAtendee } = useFieldArray({
    control: form.control,
    name: "attendees",
  } as never);

  function updateSchoolClass(payload: UpdateClassGroupPayload) {
    setIsPending(true);
    axios
      .patch("/api/classes/group/" + classDetailsDialog.data?.id, {
        ...payload,
      })
      .then((response) => {
        if (response.status === 200) {
          router.refresh();
          toast.success("Class successfully updated.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Class wasn't updated!");
      })
      .finally(() => {
        setIsPending(false);
        classDetailsDialog.close();
      });
  }

  function onSubmit(values: any) {
    const userId = classDetailsDialog.data?.schoolId
      ? classDetailsDialog.data?.schoolId
      : classDetailsDialog.data?.groupId;

    const payload = {
      ...values,
      classStatus: values.classStatus as ClassStatus,
      enrollmentId: classDetailsDialog.data?.enrollmentId || "",
      userId: userId || "",
    };
    console.log("values", payload);

    updateSchoolClass(payload);
  }

  useEffect(() => {
    const attendees = attendance?.map((attendance) => ({
      attendanceId: attendance.id,
      studentId: attendance.student.id,
      attended: attendance.attended,
      noteContent:
        notes.find((note) => note.userId === attendance.student.id)?.text || "",
      noteId:
        notes.find((note) => note.userId === attendance.student.id)?.id || "",
    }));

    console.log("attendees", attendees);

    form.setValue("attendees", attendees);
  }, [form, attendance, notes]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value}
                  onChange={field.onChange}
                  className="h-14"
                  placeholder="Class description..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classStatus"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Class Status</FormLabel>
              <FormControl>
                <DropdownSelect
                  options={[
                    {
                      value: ClassStatus.SCHEDULED,
                      label: "Scheduled",
                    },
                    {
                      value: ClassStatus.HELD,
                      label: "Held",
                    },
                    {
                      value: ClassStatus.CANCELED,
                      label: "Canceled",
                    },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="mt-6 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Attendance
        </h3>

        <div className="flex px-2 py-1 items-center mt-3 border rounded-t-md">
          <div className="flex-1 flex gap-4 sm:justify-between">
            <span className="text-muted-foreground text-sm">Student</span>
            <span className="text-muted-foreground text-sm mr-5">Attended</span>
          </div>
          <div className="min-w-50 sm:min-w-72">
            <span className="text-muted-foreground text-sm pl-2">Note</span>
          </div>
        </div>

        {isLoading && !attendance.length && (
          <div className="flex flex-row h-20 border border-t-0 relative">
            <Loader />
          </div>
        )}

        {!isLoading && !attendance.length ? (
          <div className="flex flex-row h-20 border border-t-0">
            <span className="text-sm px-6 py-2"> No students.</span>
          </div>
        ) : (
          <div className="flex flex-row max-h-80  border border-t-0 rounded-b-md">
            <div className="flex flex-1 flex-col overflow-auto">
              {attendees.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center h-14 border-b cursor-pointer pl-1 hover:bg-muted"
                >
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.attended`}
                    render={({ field }) => (
                      <FormItem className="flex flex-1 justify-between items-center ">
                        <FormLabel className="py-5 pl-2 w-full cursor-pointer ">
                          {attendance[index]?.student.firstName}{" "}
                          {attendance[index]?.student.lastName}
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            className="mr-4 sm:mr-10"
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`attendees.${index}.noteContent`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            value={field.value}
                            onChange={field.onChange}
                            className="h-[48px] min-w-50 sm:min-w-72 rounded-b-md rounded-t-md bg-card"
                            placeholder="Type note..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 mt-6">
          <Button variant="destructive" className="sm:mr-auto">
            Delete
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              classDetailsDialog.close();
            }}
          >
            Cancel
          </Button>

          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
