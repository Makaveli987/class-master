"use client";
import { GroupStudentsResponse } from "@/app/api/groups/[groupId]/students/route";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Loader from "@/components/ui/page-loader";
import { Textarea } from "@/components/ui/textarea";
import { useClassDetailsDialog } from "@/hooks/use-class-details-dialog";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface StudentProps {
  students: GroupStudentsResponse[];
  isLoading: boolean;
}

type FormValues = {
  description: string;
  attendees: { studentId: string; attended: boolean; noteContent: string }[];
};

export default function GroupClassForm({ students, isLoading }: StudentProps) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const classDetailsDialog = useClassDetailsDialog();

  const form = useForm<FormValues>({
    defaultValues: {
      description: "",
      attendees: [
        { studentId: "1", attended: false, noteContent: "" },
        { studentId: "2", attended: false, noteContent: "" },
      ],
    },
  });
  const { fields: attendees, update: updateAtendee } = useFieldArray({
    control: form.control,
    name: "attendees",
  } as never);

  function onSubmit(values: any) {
    console.log("values", values);

    // setIsPending(true);
    // !!classDetailsDialog.data
    //   ? updateClassroom(values)
    //   : createClassroom(values);
  }

  useEffect(() => {
    const attendees = students?.map((student) => ({
      studentId: student.id,
      attended: false,
      noteContent: "",
    }));

    form.setValue("attendees", attendees);
  }, [form, students]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

        <h3 className="mt-6 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Attendence
        </h3>

        <div className="flex px-2 py-1 items-center mt-3 border rounded-t-md">
          <div className="flex-1 flex gap-4 sm:justify-between">
            <span className="text-muted-foreground text-sm">Student</span>
            <span className="text-muted-foreground text-sm mr-5">Attended</span>
          </div>
          <div className="min-w-50 sm:min-w-72">
            <span className="text-muted-foreground text-sm pl-2">Note</span>
          </div>
        </div>

        {isLoading && !students.length && (
          <div className="flex flex-row h-20 border border-t-0 relative">
            <Loader />
          </div>
        )}

        {!isLoading && !students.length ? (
          <div className="flex flex-row h-20 border border-t-0">
            <span className="text-sm px-6 py-2"> No students.</span>
          </div>
        ) : (
          <div className="flex flex-row max-h-80  border border-t-0 rounded-b-md">
            <div className="flex flex-1 flex-col overflow-auto">
              {attendees.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center h-14 border-b cursor-pointer pl-1 hover:bg-muted"
                >
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.attended`}
                    render={({ field }) => (
                      <FormItem className="flex flex-1 justify-between items-center ">
                        <FormLabel className="py-5 pl-2 w-full cursor-pointer ">
                          {students[index]?.firstName}{" "}
                          {students[index]?.lastName}
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            className="mr-4 sm:mr-10"
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`attendees.${index}.noteContent`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            value={field.value}
                            onChange={field.onChange}
                            className="h-[48px] min-w-50 sm:min-w-72 rounded-b-md rounded-t-md bg-card"
                            placeholder="Type note..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 mt-6">
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
