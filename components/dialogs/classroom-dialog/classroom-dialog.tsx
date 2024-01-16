"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClassroomDialog } from "@/hooks/useClassroomDialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Enrollment } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { Loader2Icon } from "lucide-react";
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
import { Input } from "../../ui/input";

const formSchema = z.object({
  name: z.string().min(1, "Field is required"),
});

export default function ClassroomDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);

  const classroomDialog = useClassroomDialog();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!!classroomDialog.data) {
      form.setValue("name", classroomDialog.data.name || "");
    } else {
      form.setValue("name", "");
    }

    form.clearErrors();
  }, [form, classroomDialog.data]);

  function createClassroom(values: z.infer<typeof formSchema>): void {
    axios
      .post("/api/classrooms", {
        ...values,
      })
      .then((response: AxiosResponse<Enrollment[]>) => {
        if (response.status === 201) {
          router.refresh();
          toast.success("Classroom added successfully.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Classroom wasn't added!");
      })
      .finally(() => {
        setIsPending(false);
        classroomDialog.close();
      });
  }

  function updateClassroom(values: z.infer<typeof formSchema>): void {
    axios
      .patch("/api/classrooms/" + classroomDialog.data?.id, {
        ...values,
      })
      .then((response: AxiosResponse<Enrollment[]>) => {
        if (response.status === 200) {
          router.refresh();
          toast.success("Classroom, successfully updated.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Classroom, wasn't updated!");
      })
      .finally(() => {
        setIsPending(false);
        classroomDialog.close();
      });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);

    !!classroomDialog.data ? updateClassroom(values) : createClassroom(values);
  }

  return (
    <Dialog
      open={classroomDialog.isOpen}
      onOpenChange={() => {
        if (classroomDialog.isOpen) {
          classroomDialog.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {!!classroomDialog.data ? "Edit Classroom" : "Add Classroom"}
          </DialogTitle>
          <DialogDescription>Classroom at your school</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  classroomDialog.close();
                }}
              >
                Cancel
              </Button>

              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
