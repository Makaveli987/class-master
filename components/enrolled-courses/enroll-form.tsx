"use client";
import useEnrollDialog, {
  EnrollData,
  EnrollUserType,
} from "@/hooks/useEnrollDialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course, Enrollment, User, UserPerCourse } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { ComboboxOptions } from "../ui/combobox";
import { DropdownSelect } from "../ui/dropdown-select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  courseId: z.string().min(1, "Field is required"),
  teacherId: z.string().min(1, "Field is required"),
  courseGoals: z.string(),
});

export interface EnrollFormCourse extends Course {
  userPerCourses: EnrollDialogUserPerCourse[];
}
interface EnrollDialogUserPerCourse extends UserPerCourse {
  user: User;
}

interface EnrollFormProps {
  courses?: EnrollFormCourse[] | null;
  userId: string | null;
  userType: EnrollUserType;
  enrollData: EnrollData;
  action: DialogAction;
}

export default function EnrollForm({
  courses,
  userId,
  userType,
  enrollData,
  action = DialogAction.CREATE,
}: EnrollFormProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [courseOptions, setCoursesOptions] = useState<ComboboxOptions[]>([]);
  const [teachersOptions, setTeachersOptions] = useState<ComboboxOptions[]>([]);

  const router = useRouter();
  const enrollDialog = useEnrollDialog();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: enrollData,
  });

  useEffect(() => {
    console.log("action :>> ", action);

    const cOptions = courses?.map((course: Course) => ({
      value: course.id,
      label: course.name,
    }));
    setCoursesOptions(cOptions || []);
    console.log("courses :>> ", courses);
    console.log("cOptions :>> ", cOptions);
  }, [courses]);

  useEffect(() => {
    console.log("enrollData :>> ", enrollData);
    form.setValue("courseId", enrollData?.courseId);
    form.setValue("teacherId", enrollData?.teacherId);
    form.setValue("courseGoals", enrollData?.courseGoals);

    filterTeachersOptions(enrollData?.courseId);
  }, [enrollData, form]);

  function filterTeachersOptions(courseId: string) {
    const selectedCourse = courses?.find((course) => course.id === courseId);

    const tOptions = selectedCourse?.userPerCourses?.map((item: any) => ({
      value: item.user?.id,
      label: `${item.user?.firstName} ${item.user?.lastName}`,
    }));
    setTeachersOptions(tOptions || []);
  }

  function createEnrollment(values: EnrollData): void {
    axios
      .post("/api/enrollment", {
        ...values,
        userType,
        userId,
      })
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

  function updateEnrollment(values: EnrollData): void {
    axios
      .patch("/api/enrollment/" + enrollData.id, {
        ...values,
        userType,
        userId,
      })
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

  function onSubmit(values: z.infer<typeof formSchema>): void {
    setIsPending(true);
    action === DialogAction.CREATE
      ? createEnrollment({ ...values })
      : updateEnrollment({ ...values });
  }

  function getButtonText(status: "loading" | "text"): string {
    const text = enrollData ? "Save" : "Enroll";

    const loadingText = enrollData ? "Saving" : "Enrolling";

    return status === "loading" ? loadingText : text;
  }

  return (
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
            {!enrollData && (
              <Button variant="outline" onClick={() => enrollDialog.close()}>
                Close
              </Button>
            )}

            <Button
              disabled={isPending || !form.formState.isDirty}
              type="submit"
            >
              {isPending ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  {getButtonText("loading")}
                </>
              ) : (
                getButtonText("text")
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
