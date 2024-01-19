"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useClassDialog } from "@/hooks/useClassDialog";
import { ClassType } from "@/lib/models/class-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { DateTimePickerDemo } from "@/components/ui/date-time-picker";
import { Separator } from "@/components/ui/separator";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  type: z.string().min(1, "Field is required"),
  startDate: z.string().min(1, "Field is required"),
  duration: z.string().min(1, "Field is required"),
  courseId: z.string().min(1, "Field is required"),
  studentId: z.string().min(1, "Field is required"),
  originalTeacherId: z.string().min(1, "Field is required"),
  substitute: z.boolean(),
  canceled: z.boolean(),
});

export default function ClassDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);

  const classDialog = useClassDialog();
  const router = useRouter();

  const defaultValues = {
    type: ClassType.STUDENT,
    startDate: "",
    duration: "60",
    courseId: "",
    studentId: "",
    originalTeacherId: "",
    substitute: false,
    canceled: false,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const typeOptions = [
    {
      value: ClassType.STUDENT,
      label: "Individual",
    },
    { value: ClassType.GROUP, label: "Group" },
  ];

  // useEffect(() => {
  //   classDialog.data
  //     ? form.setValue("text", classDialog.data.text)
  //     : form.setValue("text", "");

  //   console.log("classDialog.data", classDialog.data);
  //   form.clearErrors();
  // }, [form, classDialog.data]);

  // function createNote(values: z.infer<typeof formSchema>): void {
  //   console.log("ID NORE", classDialog?.enrollmentId);
  //   axios
  //     .post("/api/notes", {
  //       ...values,
  //       enrollmentId: classDialog?.enrollmentId,
  //       userId: classDialog?.userId,
  //     })
  //     .then((response: AxiosResponse<Enrollment[]>) => {
  //       if (response.status === 201) {
  //         router.refresh();
  //         toast.success("Note added successfully.");
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error("Something went wrong. Note wasn't added!");
  //     })
  //     .finally(() => {
  //       setIsPending(false);
  //       classDialog.close();
  //     });
  // }

  // function updateNote(values: z.infer<typeof formSchema>): void {
  //   axios
  //     .patch("/api/notes/" + classDialog.data?.id, {
  //       ...values,
  //     })
  //     .then((response: AxiosResponse<Enrollment[]>) => {
  //       if (response.status === 200) {
  //         router.refresh();
  //         toast.success("Note successfully updated.");
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error("Something went wrong. Note wasn't updated!");
  //     })
  //     .finally(() => {
  //       setIsPending(false);
  //       classDialog.close();
  //     });
  // }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // setIsPending(true);
    console.log("values", values);
    // console.log("notesDialog.data", classDialog.data);

    // !!classDialog.data ? updateNote(values) : createNote(values);
  }

  return (
    <Dialog
      open={classDialog.isOpen}
      onOpenChange={() => {
        if (classDialog.isOpen) {
          classDialog.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {!!classDialog.data ? "Edit Class" : "Add Class"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Type</FormLabel>
                  <FormControl>
                    <DropdownSelect
                      options={typeOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col space-y-2">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DateTimePickerDemo />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col "
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl className=" cursor-pointer">
                          <RadioGroupItem value={"45"} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          45 mins
                        </FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl className=" cursor-pointer">
                          <RadioGroupItem value={"60"} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          60 mins
                        </FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl className=" cursor-pointer">
                          <RadioGroupItem value={"90"} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          90 mins
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col space-y-2">
                    <FormLabel>Student</FormLabel>
                    <FormControl>
                      <DropdownSelect
                        options={typeOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col space-y-2">
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <DropdownSelect
                        options={typeOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            /> */}

            <div className="flex gap-12">
              <FormField
                control={form.control}
                name="substitute"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        Substitute
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="canceled"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Canceled</FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* <FormField
              control={form.control}
              name="originalTeacherId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col space-y-2">
                    <FormLabel>Original teacher</FormLabel>
                    <FormControl>
                      <DropdownSelect
                        options={typeOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            /> */}

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  classDialog.close();
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
