"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import LinearLoader from "@/components/ui/linear-loader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useClassDialogForm } from "@/hooks/use-class-dialog-form";
import { useSingleClassDialog } from "@/hooks/use-single-class-dialog";
import { ClassType } from "@/lib/models/class-type";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { scheduleSingleClass } from "@/actions/classes/schedule-single-class";

const formSchema = z
  .object({
    type: z.string().min(1, "Field is required"),
    startDate: z.date({
      required_error: "Field is required.",
    }),
    duration: z.string().min(1, "Field is required"),
    enrollmentId: z.string().min(1, "Field is required"),
    attendeeId: z.string().min(1, "Field is required"),
    classroomId: z.string().min(1, "Field is required"),
    substitutedTeacherId: z.string().optional(),
    substitute: z.boolean(),
  })
  .refine((data) => !data.substitute || data.substitutedTeacherId, {
    path: ["substitutedTeacherId"],
    message: "Fields is required",
  });

interface ClassDialogProps {
  classrooms: ComboboxOptions[];
  teachers: ComboboxOptions[];
}

export default function SingleClassDialog({
  teachers,
  classrooms,
}: ClassDialogProps) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const classDialog = useSingleClassDialog();

  const session = useSession();

  //   const defaultValues = {
  //     type: ClassType.STUDENT,
  //     duration: "60",
  //     enrollmentId: "",
  //     attendeeId: "",
  //     substitute: false,
  //   };

  const defaultValues = useMemo(
    () => ({
      type: ClassType.STUDENT,
      duration: "60",
      enrollmentId: "",
      attendeeId: "",
      substitute: false,
    }),
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    isFetching,
    typeOptions,
    getAtendeeOptions,
    getEnrollmentsOptions,
    attendeeOptions,
    coursesOptions,
  } = useClassDialogForm();

  useEffect(() => {
    form.setValue("classroomId", classDialog.classroom);
    form.setValue("startDate", classDialog.startDate as Date);

    setTimeout(() => {
      form.reset(defaultValues);
    }, 200);
  }, [classDialog, defaultValues, form]);

  useEffect(() => {
    if (!classDialog.isOpen) {
      return;
    }

    getAtendeeOptions(session.data?.user.id as string, form.getValues("type"));
  }, [classDialog.isOpen]);

  async function createClass(
    values: z.infer<typeof formSchema>
  ): Promise<void> {
    await scheduleSingleClass(values)
      .then(() => {
        toast.success("Class added successfully.");
        classDialog.onSuccess?.();
      })
      .catch((error) => {
        console.error(error);

        toast.error(error.response.data.error);
      })
      .finally(() => {
        setIsPending(false);
        classDialog.close();
      });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);

    createClass(values);
  }

  function onErrors(errors: any) {
    console.log("Validation errors: ", errors);
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
      <DialogContent className="max-h-screen max-w-md overflow-y-auto overflow-x-auto">
        <DialogHeader>
          <DialogTitle>Add Single Class</DialogTitle>
        </DialogHeader>
        <div className="h-1.5">{isFetching && <LinearLoader />}</div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onErrors)}>
            <div className="space-y-6 mt-1">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Type</FormLabel>
                    <FormControl>
                      <DropdownSelect
                        disabled={isPending}
                        options={typeOptions}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          const teacherId = form.getValues(
                            "substitutedTeacherId"
                          )
                            ? form.getValues("substitutedTeacherId")
                            : session.data?.user.id;
                          getAtendeeOptions(teacherId as string, value);

                          form.setValue("attendeeId", "");
                          form.setValue("enrollmentId", "");
                        }}
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
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          disabled={isPending}
                          value={field.value}
                          onChange={field.onChange}
                        />
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
                        disabled={isPending}
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

              <div>
                <FormField
                  control={form.control}
                  name="substitute"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={(value) => {
                              // if substitute is false fetch students for current (logged in) teacher
                              if (!value) {
                                getAtendeeOptions(
                                  session.data?.user.id as string,
                                  form.getValues("type")
                                );
                              }
                              form.setValue("substitutedTeacherId", "");
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">
                          Substitute
                        </FormLabel>
                      </div>
                      <FormDescription>
                        Select if you are a substitute teacher
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div
                  className={cn(
                    "transition-all duration-300",
                    form.getValues("substitute")
                      ? "h-[70px] opacity-100 mt-4"
                      : "h-0 opacity-0 overflow-hidden"
                  )}
                >
                  <FormField
                    control={form.control}
                    name="substitutedTeacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Teacher</FormLabel>
                        <FormControl>
                          <DropdownSelect
                            disabled={isPending}
                            options={teachers.filter(
                              (teacher) =>
                                teacher.value !== session.data?.user.id
                            )}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              getAtendeeOptions(value, form.getValues("type"));

                              form.setValue("attendeeId", "");
                              form.setValue("enrollmentId", "");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription></FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="attendeeId"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      <FormLabel>
                        {form.getValues("type") === ClassType.STUDENT
                          ? "Student"
                          : "Group"}
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          disabled={isPending}
                          placeholder={
                            form.getValues("type") === ClassType.STUDENT
                              ? "Select student..."
                              : "Select group..."
                          }
                          value={field.value}
                          options={attendeeOptions}
                          onChange={(value) => {
                            field.onChange(value);
                            getEnrollmentsOptions(
                              value,
                              form.getValues("type")
                            );
                            form.setValue("enrollmentId", "");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enrollmentId"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      <FormLabel>Course</FormLabel>
                      <FormControl>
                        <DropdownSelect
                          disabled={isPending}
                          placeholder="Select course..."
                          options={coursesOptions}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classroomId"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      <FormLabel>Classroom</FormLabel>
                      <FormControl>
                        <DropdownSelect
                          disabled={isPending}
                          placeholder="Select classroom..."
                          options={classrooms}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4 gap-4 sm:gap-0">
              <Button
                disabled={isPending}
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
