"use client";
import { DefaultConfigResponse } from "@/app/api/courses/default-config/[courseId]/route";
import useEnrollDialog, { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course, Enrollment } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { ComboboxOptions } from "../ui/combobox";
import { CustomCurrencyInput } from "../ui/currency-input";
import { DropdownSelect } from "../ui/dropdown-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  courseId: z.string().min(1, "Field is required"),
  teacherId: z.string().min(1, "Field is required"),
  price: z.number().min(1, "Field is required"),
  totalClasses: z.string().min(1, "Field is required"),
  courseGoals: z.string(),
});

export default function EnrollForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [courseOptions, setCoursesOptions] = useState<ComboboxOptions[]>([]);
  const [teachersOptions, setTeachersOptions] = useState<ComboboxOptions[]>([]);
  const [priceLabel, setPriceLabel] = useState<string>("Price");

  const router = useRouter();
  const enrollDialog = useEnrollDialog();

  function setPriceInitValue() {
    let initPrice = 0;

    if (enrollDialog.data.groupId) {
      initPrice = enrollDialog?.isCompanyGroup
        ? enrollDialog.data.price
        : (enrollDialog.data.pricePerStudent as number);
    } else {
      initPrice = enrollDialog.data.price;
    }

    return initPrice;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: enrollDialog.data.courseId,
      teacherId: enrollDialog.data.teacherId,
      courseGoals: enrollDialog.data.courseGoals || "",
      price: setPriceInitValue(),
      totalClasses: enrollDialog.data.totalClasses.toString(),
    },
  });

  useEffect(() => {
    const cOptions = enrollDialog.courses
      ?.filter((course) => course.active)
      .map((course: Course) => ({
        value: course.id,
        label: course.name,
      }));
    setCoursesOptions(cOptions || []);
    filterTeachersOptions(enrollDialog.data?.courseId);

    if (
      enrollDialog.userType === EnrollUserType.GROUP &&
      !enrollDialog?.isCompanyGroup
    ) {
      setPriceLabel("Price Per Student");
    }
  }, [enrollDialog.courses]);

  function filterTeachersOptions(courseId: string) {
    const selectedCourse = enrollDialog.courses?.find(
      (course) => course.id === courseId
    );

    const tOptions = selectedCourse?.userPerCourses
      ?.filter((item) => item.user.active)
      .map((item: any) => ({
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
        // Price here can be represented as Price Per Student is group is not Company
        // Logic is handled on server
        price: values.price,
        totalClasses: parseInt(values.totalClasses),
      })
      .then((response: AxiosResponse<Enrollment[]>) => {
        if (response.status === 201) {
          router.refresh();
          toast.success("Student successfully enrolled.");
        }
      })
      .catch((error) => {
        const errorMessage = error.response.data.error.message
          ? error.response.data.error.message
          : "Something went wrong. Student wasn't enrolled!";
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsPending(false);
        enrollDialog.close();
      });
  }

  function updateEnrollment(values: z.infer<typeof formSchema>): void {
    const payload = {
      ...values,
      userType: enrollDialog.userType,
      userId: enrollDialog.userId,
      // Price here can be represented as Price Per Student is group is not Company
      // Logic is handled on server
      price: values.price,
      totalClasses: parseInt(values.totalClasses),
    };

    axios
      .patch("/api/enrollment/" + enrollDialog.data.id, {
        ...payload,
      })
      .then((response: AxiosResponse<Enrollment[]>) => {
        if (response.status === 200) {
          router.refresh();
          toast.success(
            `${
              enrollDialog.userType === EnrollUserType.STUDENT
                ? "Student"
                : "Group"
            } enrollment successfully updated.`
          );
        }
      })
      .catch((error) => {
        toast.error(
          `Something went wrong. ${
            enrollDialog.userType === EnrollUserType.STUDENT
              ? "Student"
              : "Group"
          } enrollment wasn't updated!`
        );
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
        if (enrollDialog.userType === EnrollUserType.GROUP) {
          if (enrollDialog?.isCompanyGroup) {
            form.setValue("price", response.data?.defaultGroupPrice || 0);
            setPriceLabel("Price");
          } else {
            form.setValue("price", response.data?.defaultPricePerStudent || 0);
          }
          setPriceLabel("Price Per Student");
        } else {
          form.setValue("price", response.data.defaultPrice);
          setPriceLabel("Price");
        }
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormLabel>{priceLabel}</FormLabel>
                <FormControl>
                  <CustomCurrencyInput
                    disabled={isPending}
                    allowNegativeValue={false}
                    value={field.value}
                    onValueChange={(value, name, values) => {
                      field.onChange(values?.float);
                    }}
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
