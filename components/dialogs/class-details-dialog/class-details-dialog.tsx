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
import { useEffect, useState } from "react";
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

const formSchema = z.object({
  description: z.string(),
  note: z.string(),
  classStatus: z.string(),
});

export default function ClassDetailsDialog() {
  // const [isPending, setIsPending] = useState<boolean>(false);

  const classDetailsDialog = useClassDetailsDialog();
  const router = useRouter();

  // const defaultValues = {
  //   description: "",
  //   note: "",
  //   classStatus: classDetailsDialog.data?.schoolClassStatus,
  // };

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues,
  // });

  // useEffect(() => {
  //   console.log("classDetailsDialog.data :>> ", classDetailsDialog.data);
  //   // setTimeout(() => {
  //   form.reset(defaultValues);
  //   // }, 200);
  // }, [form, classDetailsDialog.data]);

  // function createClassroom(values: z.infer<typeof formSchema>): void {
  //   axios
  //     .post("/api/classrooms", {
  //       ...values,
  //     })
  //     .then((response: AxiosResponse<Enrollment[]>) => {
  //       if (response.status === 201) {
  //         router.refresh();
  //         toast.success("Classroom added successfully.");
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error("Something went wrong. Classroom wasn't added!");
  //     })
  //     .finally(() => {
  //       setIsPending(false);
  //       classDetailsDialog.close();
  //     });
  // }

  // function updateClassroom(values: z.infer<typeof formSchema>): void {
  //   axios
  //     .patch("/api/classrooms/" + classDetailsDialog.data?.id, {
  //       ...values,
  //     })
  //     .then((response: AxiosResponse<Enrollment[]>) => {
  //       if (response.status === 200) {
  //         router.refresh();
  //         toast.success("Classroom, successfully updated.");
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error("Something went wrong. Classroom, wasn't updated!");
  //     })
  //     .finally(() => {
  //       setIsPending(false);
  //       classDetailsDialog.close();
  //     });
  // }

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   setIsPending(true);

  //   !!classDetailsDialog.data
  //     ? updateClassroom(values)
  //     : createClassroom(values);
  // }

  return (
    <Dialog
      open={classDetailsDialog.isOpen}
      onOpenChange={() => {
        if (classDetailsDialog.isOpen) {
          classDetailsDialog.close();
        }
      }}
    >
      <DialogContent className="max-w-[700px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Class Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-3 gap-6 mt-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
              <UserIcon />
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-muted-foreground text-xs">Student</span>
              <span className="font-medium">{`${classDetailsDialog.data?.student?.firstName} ${classDetailsDialog.data?.student?.lastName}`}</span>
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

        <Separator className="mt-6 mb-4" />

        {classDetailsDialog.data?.studentId ? <StudentClassForm /> : null}

        {/* <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      className="h-20"
                      placeholder="Class description..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Note</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value}
                      onChange={field.onChange}
                      className="h-20"
                      placeholder="Type note..."
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
                <FormItem>
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

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
            <DialogFooter>
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
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
            </div>
          </form>
        </Form> */}
      </DialogContent>
    </Dialog>
  );
}
