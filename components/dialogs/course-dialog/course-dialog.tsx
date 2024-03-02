"use client";
import { Button } from "@/components/ui/button";
import { CustomCurrencyInput } from "@/components/ui/currency-input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useCourseDialog from "@/hooks/use-course-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Field is required").min(3, {
    message: "Name is too short",
  }),
  description: z.string(),
  defaultPrice: z.string(),
  defaultGroupPrice: z.string(),
  defaultPricePerStudent: z.string(),
  defaultTotalClasses: z.string().min(1, "Field is required"),
});

export default function CourseDialog() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const courseDialog = useCourseDialog();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const defValues = courseDialog.data
      ? {
          name: courseDialog.data.name,
          description: courseDialog.data.description,
          defaultPrice: courseDialog.data.defaultPrice.toString(),
          defaultGroupPrice: courseDialog.data.defaultGroupPrice?.toString(),
          defaultPricePerStudent:
            courseDialog.data.defaultPricePerStudent?.toString(),
          defaultTotalClasses: courseDialog.data.defaultTotalClasses.toString(),
        }
      : {
          name: "",
          description: "",
          defaultPrice: "",
          defaultGroupPrice: "",
          defaultPricePerStudent: "",
          defaultTotalClasses: "",
        };
    form.reset(defValues);
  }, [courseDialog.data, form]);

  function createCourse(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      defaultPrice: parseInt(values.defaultPrice),
      defaultGroupPrice: parseInt(values.defaultGroupPrice),
      defaultPricePerStudent: parseInt(values.defaultPricePerStudent),
      defaultTotalClasses: parseInt(values.defaultTotalClasses),
    };

    axios
      .post("/api/courses", { ...payload })
      .then((response: AxiosResponse<Course[]>) => {
        if (response.status === 201) {
          toast.success("Course has been created", {
            description: `${values.name}`,
          });
          form.reset();
          router.refresh();
          courseDialog.close();
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Course wasn't created!", {
          description: `${values.name}`,
        });
        console.error(error);
      })
      .finally(() => setPending(false));
  }

  function updateCourse(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      defaultPrice: parseInt(values.defaultPrice),
      defaultGroupPrice: parseInt(values.defaultGroupPrice),
      defaultPricePerStudent: parseInt(values.defaultPricePerStudent),
      defaultTotalClasses: parseInt(values.defaultTotalClasses),
    };

    axios
      .patch("/api/courses/" + courseDialog.data?.id, { ...payload })
      .then((response: AxiosResponse<Course>) => {
        if (response.status === 200) {
          toast.success("Course has been updated", {
            description: `${values.name}`,
          });
          courseDialog.close();
          router.refresh();
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Course wasn't updated!", {
          description: `${values.name}`,
        });
        console.error(error);
      })
      .finally(() => setPending(false));
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);

    courseDialog.action === DialogAction.CREATE
      ? createCourse(values)
      : updateCourse(values);
  }

  return (
    <Dialog
      open={courseDialog.isOpen}
      onOpenChange={() => {
        if (courseDialog.isOpen) {
          courseDialog.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Course</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={pending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input disabled={pending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultTotalClasses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Number Of Classes</FormLabel>
                  <FormControl>
                    <Input disabled={pending} type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5 pt-2">
                <h3 className="font-semibold leading-none tracking-tight">
                  Course Pricing Overview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Set default prices for the course, which can be modified
                  during course enrollment.
                </p>
              </div>

              <FormField
                control={form.control}
                name="defaultPrice"
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center">
                    <FormLabel>Individual Course</FormLabel>
                    <FormControl className="w-40">
                      <CustomCurrencyInput
                        disabled={pending}
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
                name="defaultGroupPrice"
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center">
                    <FormLabel>Group Course</FormLabel>
                    <FormControl className="w-40">
                      <CustomCurrencyInput
                        disabled={pending}
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
                name="defaultPricePerStudent"
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center">
                    <FormLabel>Per Student In Group</FormLabel>
                    <FormControl className="w-40">
                      <CustomCurrencyInput
                        disabled={pending}
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
            </div>

            <DialogFooter className="pt-2">
              <Button
                disabled={pending}
                type="reset"
                onClick={() => {
                  form.reset();
                  courseDialog.close();
                }}
                variant="outline"
              >
                Close
              </Button>

              <Button
                disabled={pending || !form.formState.isDirty}
                type="submit"
              >
                {pending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>Save</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
