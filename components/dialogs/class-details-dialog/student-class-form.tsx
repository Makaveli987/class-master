"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassStatus } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  description: z.string(),
  note: z.string(),
  classStatus: z.string(),
});

export default function StudentClassForm() {
  const [isPending, setIsPending] = useState<boolean>(false);

  const classDetailsDialog = useClassDetailsDialog();

  const defaultValues = {
    description: "",
    note: "",
    classStatus: classDetailsDialog.data?.schoolClassStatus,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // setIsPending(true);
    // !!classDetailsDialog.data
    //   ? updateClassroom(values)
    //   : createClassroom(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  className="h-20"
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
                  className="h-20"
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

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
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
                <Loader2Icon className="h-4 w-4 animate-spin" />
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
