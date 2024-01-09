"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogAction } from "@/lib/models/dialog-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Field is required").min(3, {
    message: "Name is too short",
  }),
  description: z.string(),
  pricePerClass: z.string().min(1, "Field is required"),
  totalClasses: z.string().min(1, "Field is required"),
});

interface CourseFormProps {
  data?: Course | null;
  setDialogOpen?: Dispatch<SetStateAction<boolean>>;
  action?: DialogAction;
}

export default function CourseForm({
  data,
  setDialogOpen,
  action = DialogAction.CREATE,
}: CourseFormProps) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const defValues = data
    ? {
        name: data.name,
        description: data.description,
        pricePerClass: data.pricePerClass.toString(),
        totalClasses: data.totalClasses.toString(),
      }
    : {
        name: "",
        description: "",
        pricePerClass: "",
        totalClasses: "",
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defValues,
  });

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
          setDialogOpen?.(false);
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
      .patch("/api/courses/" + data?.id, { ...payload })
      .then((response: AxiosResponse<Course>) => {
        if (response.status === 200) {
          toast.success("Course has been updated", {
            description: `${values.name}`,
          });
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

    action === DialogAction.CREATE
      ? createCourse(values)
      : updateCourse(values);
  }

  return (
    <div className="grid gap-4">
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

          <div className="flex items-center justify-end gap-2">
            {action === DialogAction.CREATE && (
              <Button
                disabled={pending}
                type="reset"
                onClick={() => {
                  form.reset();
                  setDialogOpen?.(false);
                }}
                className="!mt-6 "
                variant="outline"
              >
                Close
              </Button>
            )}

            <Button
              disabled={pending || !form.formState.isDirty}
              className="!mt-6"
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
          </div>
        </form>
      </Form>
    </div>
  );
}
