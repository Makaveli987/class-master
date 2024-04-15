"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNoteDialog } from "@/hooks/use-note-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "../../ui/textarea";
import { Enrollment } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import {
  CourseOptionsResponse,
  getCourseOptions,
} from "@/actions/courses/get-course-options";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";

const formSchema = z.object({
  enrollmentId: z.string().min(1, "Field is required"),
  text: z.string().min(1, "Field is required"),
});

export default function NotesDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [courseOptions, setCourseOptions] = useState<ComboboxOptions[]>([]);
  const [showCopurseOptions, setShowCourseOptions] = useState(false);

  const noteDialog = useNoteDialog();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: "" },
  });

  useEffect(() => {
    if (noteDialog.userId) {
      getCourseOptions(
        noteDialog.userId,
        noteDialog?.userType as EnrollUserType
      )
        .then((response: CourseOptionsResponse) => {
          if (response.data) {
            setCourseOptions(response.data);
          }
          if (response.info) {
            toast.info(response.info);
          }
          if (response.error) {
            toast.info(response.error);
          }
        })
        .catch((error) => console.log("error :>> ", error));
    }

    noteDialog.data
      ? form.setValue("text", noteDialog.data.text)
      : form.setValue("text", "");

    if (noteDialog.enrollmentId) {
      form.setValue("enrollmentId", noteDialog.enrollmentId);
      setShowCourseOptions(false);
    } else if (noteDialog.data?.enrollmentId) {
      form.setValue("enrollmentId", noteDialog.data?.enrollmentId);
      setShowCourseOptions(false);
    } else {
      form.setValue("enrollmentId", "");
      setShowCourseOptions(true);
    }

    form.clearErrors();
  }, [form, noteDialog.data]);

  function createNote(values: z.infer<typeof formSchema>): void {
    setIsPending(true);
    axios
      .post("/api/notes", {
        ...values,
        userId: noteDialog?.userId,
        userType: noteDialog?.userType,
      })
      .then((response: AxiosResponse<Enrollment[]>) => {
        if (response.status === 201) {
          router.refresh();
          toast.success("Note added successfully.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Note wasn't added!");
      })
      .finally(() => {
        setIsPending(false);
        noteDialog.close();
      });
  }

  function updateNote(values: z.infer<typeof formSchema>): void {
    axios
      .patch("/api/notes/" + noteDialog.data?.id, {
        ...values,
      })
      .then((response: AxiosResponse<Enrollment[]>) => {
        if (response.status === 200) {
          router.refresh();
          toast.success("Note successfully updated.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Note wasn't updated!");
      })
      .finally(() => {
        setIsPending(false);
        noteDialog.close();
      });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);

    !!noteDialog.data ? updateNote(values) : createNote(values);
  }

  return (
    <Dialog
      open={noteDialog.isOpen}
      onOpenChange={() => {
        if (noteDialog.isOpen) {
          noteDialog.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {!!noteDialog.data ? "Edit Note" : "Add Note"}
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
            {showCopurseOptions && (
              <FormField
                control={form.control}
                name="enrollmentId"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      <FormLabel>Course</FormLabel>
                      <FormControl>
                        <Combobox
                          disabled={isPending}
                          placeholder="Select course..."
                          value={field.value}
                          options={courseOptions}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      className="h-32"
                      placeholder="Type note..."
                      {...field}
                    />
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
                  noteDialog.close();
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
