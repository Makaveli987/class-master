"use client";
import { UpdateClassPayload } from "@/app/api/classes/student/[schoolClassId]/route";
import { NoteResponse } from "@/app/api/notes/class/[schoolClassId]/route";
import { Button } from "@/components/ui/button";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useClassDetailsDialog } from "@/hooks/use-class-details-dialog";
import useFilteredClasses from "@/hooks/use-filter-classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassStatus } from "@prisma/client";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  description: z.string().optional(),
  note: z.string().optional(),
  classStatus: z.string().optional(),
});

interface StudentClassFormProps {
  notes: NoteResponse[];
  isLoading?: boolean;
}

export default function StudentClassForm({
  isLoading,
  notes,
}: StudentClassFormProps) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const classDetailsDialog = useClassDetailsDialog();
  const router = useRouter();

  const defaultValues = {
    description: classDetailsDialog.data?.description || "",
    note: "",
    classStatus: classDetailsDialog.data?.schoolClassStatus,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.setValue("note", notes[0]?.text);
  }, [form, notes]);

  function updateSchoolClass(payload: UpdateClassPayload) {
    setIsPending(true);
    axios
      .patch("/api/classes/student/" + classDetailsDialog.data?.id, {
        ...payload,
      })
      .then((response) => {
        if (response.status === 200) {
          router.refresh();
          toast.success("Class successfully updated.");
          classDetailsDialog.onSuccess?.();
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Class wasn't updated!");
      })
      .finally(() => {
        setIsPending(false);
        classDetailsDialog.close();
      });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const userId = classDetailsDialog.data?.schoolId
      ? classDetailsDialog.data?.schoolId
      : classDetailsDialog.data?.groupId;

    const payload: UpdateClassPayload = {
      ...values,
      classStatus: values.classStatus as ClassStatus,
      enrollmentId: classDetailsDialog.data?.enrollmentId || "",
      userId: userId || "",
      noteId: notes[0]?.id || "",
    };

    updateSchoolClass(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value}
                  onChange={field.onChange}
                  className="h-14"
                  placeholder="Class description..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Note</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value}
                  onChange={field.onChange}
                  className="h-14"
                  placeholder="Type note..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Status</FormLabel>
              <FormControl>
                <DropdownSelect
                  options={[
                    {
                      value: ClassStatus.SCHEDULED,
                      label: "Scheduled",
                    },
                    {
                      value: ClassStatus.HELD,
                      label: "Held",
                    },
                    {
                      value: ClassStatus.CANCELED,
                      label: "Canceled",
                    },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 pt-2">
          <Button variant="destructive" className="sm:mr-auto">
            Delete
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              classDetailsDialog.close();
            }}
          >
            Cancel
          </Button>

          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
