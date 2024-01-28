"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useExamDialog } from "@/hooks/use-exam-dialog";
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
  result: z.string().min(1, "Field is required"),
  comment: z.string(),
});

export default function ExamDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);

  const examDialog = useExamDialog();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", result: "", comment: "" },
  });

  useEffect(() => {
    if (!!examDialog.data) {
      form.setValue("name", examDialog.data.name || "");
      form.setValue("result", examDialog.data.result || "");
      form.setValue("comment", examDialog.data.comment || "");
    } else {
      form.setValue("name", "");
      form.setValue("result", "");
      form.setValue("comment", "");
    }

    form.clearErrors();
  }, [form, examDialog.data]);

  function createExam(values: z.infer<typeof formSchema>): void {
    axios
      .post("/api/exams", {
        ...values,
        enrollmentId: examDialog?.enrollmentId,
        studentId: examDialog?.studentId,
      })
      .then((response: AxiosResponse<Enrollment[]>) => {
        if (response.status === 201) {
          router.refresh();
          toast.success("Exam added successfully.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Exam wasn't added!");
      })
      .finally(() => {
        setIsPending(false);
        examDialog.close();
      });
  }

  function updateExam(values: z.infer<typeof formSchema>): void {
    axios
      .patch("/api/exams/" + examDialog.data?.id, {
        ...values,
      })
      .then((response: AxiosResponse<Enrollment[]>) => {
        if (response.status === 200) {
          router.refresh();
          toast.success("Exam, successfully updated.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Exam, wasn't updated!");
      })
      .finally(() => {
        setIsPending(false);
        examDialog.close();
      });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);

    !!examDialog.data ? updateExam(values) : createExam(values);
  }

  return (
    <Dialog
      open={examDialog.isOpen}
      onOpenChange={() => {
        if (examDialog.isOpen) {
          examDialog.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {!!examDialog.data ? "Edit Exam" : "Add Exam"}
          </DialogTitle>
          <DialogDescription>
            Teacher note for this course enrollment
          </DialogDescription>
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

            <FormField
              control={form.control}
              name="result"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Result</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Result"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      className="h-32"
                      placeholder="Comment"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  examDialog.close();
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
