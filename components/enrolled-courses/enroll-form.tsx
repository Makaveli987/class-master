"use client";
import useEnrollDialog from "@/hooks/use-enroll-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course, Enrollment, User, UserPerCourse } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { ComboboxOptions } from "../ui/combobox";
import { DropdownSelect } from "../ui/dropdown-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { DefaultConfigResponse } from "@/app/api/courses/default-config/[course-id]/route";
import { Input } from "../ui/input";

const formSchema = z.object({
  courseId: z.string().min(1, "Field is required"),
  teacherId: z.string().min(1, "Field is required"),
  price: z.string().min(1, "Field is required"),
  totalClasses: z.string().min(1, "Field is required"),
  courseGoals: z.string(),
});

export default function EnrollForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [courseOptions, setCoursesOptions] = useState<ComboboxOptions[]>([]);
  const [teachersOptions, setTeachersOptions] = useState<ComboboxOptions[]>([]);

  const router = useRouter();
  const enrollDialog = useEnrollDialog();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: enrollDialog.data.courseId,
      teacherId: enrollDialog.data.teacherId,
      courseGoals: enrollDialog.data.courseGoals || "",
      price: enrollDialog.data.price.toString(),
      totalClasses: enrollDialog.data.totalClasses.toString(),
    },
  });

  useEffect(() => {
    const cOptions = enrollDialog.courses?.map((course: Course) => ({
      value: course.id,
      label: course.name,
    }));
    setCoursesOptions(cOptions || []);
    filterTeachersOptions(enrollDialog.data?.courseId);
  }, [enrollDialog]);

  function filterTeachersOptions(courseId: string) {
    const selectedCourse = enrollDialog.courses?.find(
      (course) => course.id === courseId
    );

    const tOptions = selectedCourse?.userPerCourses?.map((item: any) => ({
      value: item.user?.id,
      label: `${item.user?.firstName} ${item.user?.lastName}`,
    }));
    setTeachersOptions(tOptions || []);
  }

  function createEnrollment(values: z.infer<typeof formSchema>): void {
    axios
      .post("/api/enrollment", {
        ...values,
        userType: enrollDialog.userType,
        userId: enrollDialog.userId,
        price: parseInt(values.price),
        totalClasses: parseInt(values.totalClasses),
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

  function updateEnrollment(values: z.infer<typeof formSchema>): void {
    axios
      .patch("/api/enrollment/" + enrollDialog.data.id, {
        ...values,
        userType: enrollDialog.userType,
        userId: enrollDialog.userId,
        price: parseInt(values.price),
        totalClasses: parseInt(values.totalClasses),
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

  function getDefaultPriceAndClasses(courseId: string) {
    axios
      .get("/api/courses/default-config/" + courseId)
      .then((response: AxiosResponse<DefaultConfigResponse>) => {
        form.setValue("price", response.data.defaultPrice.toString());
        form.setValue(
          "totalClasses",
          response.data.defaultTotalClasses.toString()
        );
      })
      .catch(() => {})
      .finally(() => {});
  }

  function onSubmit(values: z.infer<typeof formSchema>): void {
    setIsPending(true);
    enrollDialog.action === DialogAction.CREATE
      ? createEnrollment({ ...values })
      : updateEnrollment({ ...values });
  }

  function getButtonText(status: "loading" | "text"): string {
    const text = !!enrollDialog.data ? "Save" : "Enroll";

    const loadingText = !!enrollDialog.data ? "Saving" : "Enrolling";

    return status === "loading" ? loadingText : text;
  }

  return (
    <div className="flex flex-col gap-3">
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
                      filterTeachersOptions(value);
                      getDefaultPriceAndClasses(value);
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
            disabled={!form.getValues().courseId || isPending}
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
            name="price"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="number"
                    placeholder="Enter price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalClasses"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number Of Classes</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="number"
                    placeholder="Enter number of classes"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseGoals"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goals</FormLabel>
                <FormControl>
                  <Textarea
                    readOnly={isPending}
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
            <Button
              variant="outline"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                enrollDialog.close();
              }}
            >
              Close
            </Button>

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
