"use client";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Course, Enrollment, User, UserPerCourse } from "@prisma/client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { string, z } from "zod";
import axios, { AxiosResponse } from "axios";
import router from "next/router";
import { useRouter } from "next/navigation";
import useEnrollDialog, { EnrollData } from "@/hooks/useEnrollDialog";

export interface EnrollDialogCourse extends Course {
  userPerCourses: EnrollDialogUserPerCourse[];
}
interface EnrollDialogUserPerCourse extends UserPerCourse {
  user: User;
}

interface EnrollDialogProps {
  children?: React.ReactNode;
  courses?: EnrollDialogCourse[] | null;
  studentId: string;
}

const formSchema = z.object({
  courseId: z.string().min(1, "Field is required"),
  teacherId: z.string().min(1, "Field is required"),
  courseGoals: z.string(),
});

export default function EnrollStudentDialog({
  children,
  studentId,
  courses,
}: EnrollDialogProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [courseOptions, setCoursesOptions] = useState<ComboboxOptions[]>([]);
  const [teachersOptions, setTeachersOptions] = useState<ComboboxOptions[]>([]);

  const router = useRouter();
  const enrollDialog = useEnrollDialog();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: enrollDialog.data,
  });

  useEffect(() => {
    const cOptions = courses?.map((course: Course) => ({
      value: course.id,
      label: course.name,
    }));
    setCoursesOptions(cOptions || []);
  }, [courses]);

  useEffect(() => {
    form.setValue("courseId", enrollDialog.data?.courseId);
    form.setValue("teacherId", enrollDialog.data?.teacherId);
    form.setValue("courseGoals", enrollDialog.data?.courseGoals);

    filterTeachersOptions(enrollDialog.data.courseId);
  }, [enrollDialog.data, form]);

  function filterTeachersOptions(courseId: string) {
    const selectedCourse = courses?.find((course) => course.id === courseId);

    const tOptions = selectedCourse?.userPerCourses?.map((item: any) => ({
      value: item.user?.id,
      label: `${item.user?.firstName} ${item.user?.lastName}`,
    }));
    setTeachersOptions(tOptions || []);
  }

  function createEnrollment(values: EnrollData) {
    axios
      .post("/api/enrollment", { ...values })
      .then((response: AxiosResponse<Enrollment[]>) => {
        if (response.status === 201) {
          router.refresh();
          toast.success("Student successfully enrolled.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Student wasn't enrolled!");
      })
      .finally(() => {
        setIsPending(false);
        enrollDialog.close();
      });
  }

  function updateEnrollment(values: EnrollData) {
    axios
      .patch("/api/enrollment/" + enrollDialog.data.enrollmentId, { ...values })
      .then((response: AxiosResponse<Enrollment[]>) => {
        if (response.status === 200) {
          router.refresh();
          toast.success("Student enrollment successfully updated.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Student enrollment wasn't updated!");
      })
      .finally(() => {
        setIsPending(false);
        enrollDialog.close();
      });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    enrollDialog.action === "create"
      ? createEnrollment({ ...values, studentId })
      : updateEnrollment({ ...values, studentId });
  }

  return (
    <Dialog
      open={enrollDialog.isOpen}
      onOpenChange={() => {
        if (enrollDialog.isOpen) {
          enrollDialog.close();
        } else {
          enrollDialog.open(
            {
              courseId: enrollDialog.data.courseId,
              teacherId: enrollDialog.data.teacherId,
              courseGoals: enrollDialog.data.courseGoals,
            },
            "student",
            "create"
          );
        }
        setTimeout(() => {
          form.reset();
        }, 100);
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enroll Student</DialogTitle>
          <DialogDescription>
            Select the course and teacher for the student
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 mt-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                disabled={isPending}
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <DropdownSelect
                        disabled={isPending}
                        options={courseOptions}
                        onChange={(value) => {
                          form.setValue("teacherId", "");
                          console.log("object :>> ", form.getValues());
                          filterTeachersOptions(value);
                          field.onChange(value);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <FormControl>
                      <DropdownSelect
                        disabled={!form.getValues().courseId || isPending}
                        options={teachersOptions}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courseGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isPending}
                        className="h-32"
                        placeholder="Type the goals here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button asChild variant="outline">
                  <DialogClose>Cancel</DialogClose>
                </Button>

                <Button disabled={isPending} type="submit">
                  Enroll
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
