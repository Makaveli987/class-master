"use client";
import useCourseDialog from "@/hooks/use-course-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { DialogAction } from "@/lib/models/dialog-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, "Field is required").min(3, {
    message: "Name is too short",
  }),
  description: z.string(),
  pricePerClass: z.string().min(1, "Field is required"),
  totalClasses: z.string().min(1, "Field is required"),
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
          pricePerClass: courseDialog.data.pricePerClass.toString(),
          totalClasses: courseDialog.data.totalClasses.toString(),
        }
      : {
          name: "",
          description: "",
          pricePerClass: "",
          totalClasses: "",
        };
    form.reset(defValues);
  }, [courseDialog.data, form]);

  function createCourse(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      pricePerClass: parseInt(values.pricePerClass),
      totalClasses: parseInt(values.totalClasses),
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
      pricePerClass: parseInt(values.pricePerClass),
      totalClasses: parseInt(values.totalClasses),
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
                    <Input disabled={pending} placeholder="Name" {...field} />
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
                    <Input
                      disabled={pending}
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePerClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Class</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      type="number"
                      placeholder="Price per Class"
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Classes</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      type="number"
                      placeholder="Total Clases"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
