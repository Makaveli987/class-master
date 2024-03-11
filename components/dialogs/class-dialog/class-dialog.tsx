"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import { DateRangePicker } from "@/components/ui/date-range-picker";
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
import { TimePicker } from "@/components/ui/time-picker";
import { useClassDialog } from "@/hooks/use-class-dialog";
import { ClassType } from "@/lib/models/class-type";
import { RepeatScheduleType } from "@/lib/models/repeat-schedule";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { addDays } from "date-fns";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
    repeat: z.boolean(),
    repeatConfig: z.object({
      repeatSchedule: z.string().min(1, "Field is required"),
      range: z.object({
        from: z.date(),
        to: z.date(),
      }),
      firstWeekTime: z.date(),
      secondWeekTime: z.date(),
    }),
  })
  .refine((data) => !data.substitute || data.substitutedTeacherId, {
    path: ["substitutedTeacherId"],
    message: "Fields is required",
  })
  .refine(
    (data) =>
      !(data.repeat && data.repeatConfig.repeatSchedule === "SHIFTS") ||
      (data.repeatConfig.firstWeekTime && data.repeatConfig.secondWeekTime),
    {
      path: ["repeatConfig"],
      message:
        "Both firstWeekTime and secondWeekTime are required when repeat is true and repeatSchedule is 'shift'",
    }
  );

const repeatOptions = [
  { value: RepeatScheduleType.SAME_TIME, label: "Same Time" },
  { value: RepeatScheduleType.SHIFTS, label: "Shifts" },
];

interface ClassDialogProps {
  classrooms: ComboboxOptions[];
  teachers: ComboboxOptions[];
}

export default function ClassDialog({
  teachers,
  classrooms,
}: ClassDialogProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState(false);
  const [attendeeOptions, setAttendeeOptions] = useState([]);
  const [enrolledCoursesOptions, setEnrolledCoursesOptions] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const classDialog = useClassDialog();
  const router = useRouter();

  const session = useSession();

  const defaultValues = {
    type: ClassType.STUDENT,
    duration: "60",
    enrollmentId: "",
    attendeeId: "",
    substitute: false,
    repeat: false,
    repeatConfig: {
      repeatSchedule: RepeatScheduleType.SAME_TIME,
    },
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

  useEffect(() => {
    form.setValue("classroomId", classDialog.classroom);
    form.setValue("startDate", classDialog.startDate as Date);
    form.setValue("repeatConfig.range.from", classDialog.startDate as Date);
    form.setValue(
      "repeatConfig.range.to",
      addDays(classDialog.startDate as Date, 30)
    );
    form.setValue("repeatConfig.firstWeekTime", classDialog.startDate as Date);
    form.setValue("repeatConfig.secondWeekTime", classDialog.startDate as Date);

    filterCourseOptions();

    // form.reset(defaultValues);

    setTimeout(() => {
      form.reset(defaultValues);
    }, 200);
  }, [classDialog, form]);

  const getStudents = useCallback(
    (teacherId?: string): void => {
      setIsFetching(true);

      axios
        .get("/api/students/", {
          params: teacherId ? { substituteTeacher: teacherId } : null,
        })
        .then((response: any) => {
          setAttendeeOptions(response.data);
        })
        .catch((error: any) => {
          toast.error("Something went wrong. Error fetching students!");
        })
        .finally(() => setIsFetching(false));
    },
    [setAttendeeOptions]
  );

  const getStudentEnrollments = useCallback(
    (teacherId?: string): void => {
      setAttendeeOptions([]);
      setIsFetching(true);

      axios
        .get("/api/students/enrollments", {
          params: teacherId ? { substituteTeacher: teacherId } : null,
        })
        .then((response: any) => {
          setEnrolledCourses(response.data);
        })
        .catch((error: any) => {
          toast.error("Something went wrong. Error fetching enrollments!");
        })
        .finally(() => setIsFetching(false));
    },
    [setAttendeeOptions]
  );

  const getGroups = useCallback(
    (teacherId?: string): void => {
      setIsFetching(true);

      axios
        .get("/api/groups/", {
          params: teacherId ? { substituteTeacher: teacherId } : null,
        })
        .then((response: any) => {
          console.log("response.data :>> ", response.data);
          setAttendeeOptions(response.data);
        })
        .catch((error: any) => {
          toast.error("Something went wrong. Error fetching groups!");
        })
        .finally(() => setIsFetching(false));
    },
    [setAttendeeOptions]
  );

  const getGroupEnrollments = useCallback(
    (teacherId?: string): void => {
      setAttendeeOptions([]);
      setIsFetching(true);

      axios
        .get("/api/groups/enrollments", {
          params: teacherId ? { substituteTeacher: teacherId } : null,
        })
        .then((response: any) => {
          setEnrolledCourses(response.data);
        })
        .catch((error: any) => {
          toast.error("Something went wrong. Error fetching enrollments!");
        })
        .finally(() => setIsFetching(false));
    },
    [setAttendeeOptions]
  );

  const filterCourseOptions = useCallback(() => {
    const atendeeId = form.getValues("attendeeId");
    const options = enrolledCourses?.find(
      // @ts-ignore
      (course) => course.atendeeId === atendeeId
    );
    // @ts-ignore
    setEnrolledCoursesOptions(options?.courses);
  }, [enrolledCourses, form]);

  const getAttendeesAndCourses = useCallback(() => {
    const classType = form.getValues("type");
    const isSubstitute = form.getValues("substitute");
    const substitutedTeacherId = form.getValues("substitutedTeacherId");
    form.setValue("attendeeId", "");
    form.setValue("enrollmentId", "");

    if (classType === ClassType.STUDENT) {
      getStudents(substitutedTeacherId);
      getStudentEnrollments(substitutedTeacherId);
    } else {
      getGroups(substitutedTeacherId);
      getGroupEnrollments(substitutedTeacherId);
    }
    filterCourseOptions();
  }, [
    filterCourseOptions,
    form,
    getGroupEnrollments,
    getGroups,
    getStudentEnrollments,
    getStudents,
  ]);

  useEffect(() => {
    getAttendeesAndCourses();
  }, [classDialog]);

  function createClass(values: z.infer<typeof formSchema>): void {
    axios
      .post("/api/classes", {
        ...values,
      })
      .then((response) => {
        if (response.data.skippedDates) {
          toast.warning(
            "Some classes were not scheduled due to selected time not being available."
          );
        }
        if (response.status === 201 && !response.data.skippedDates) {
          // router.refresh();
          classDialog?.refreshCalendar?.();
          toast.success("Class added successfully.");
          classDialog.onSuccess?.();
        }
      })
      .catch((error) => {
        console.error(error);

        toast.error(error.response.data.error);
      })
      .finally(() => {
        setIsPending(false);
        classDialog.close();
      });
    // setIsPending(false);
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
      <DialogContent className="max-h-screen overflow-y-auto overflow-x-auto">
        <DialogHeader>
          <DialogTitle>Add Class</DialogTitle>
        </DialogHeader>
        <div className="h-1.5">{isFetching && <LinearLoader />}</div>

        <Form {...form}>
          <form
            className="max-w-88"
            onSubmit={form.handleSubmit(onSubmit, onErrors)}
          >
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
                          getAttendeesAndCourses();
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
                                form.setValue("substitutedTeacherId", "");
                                getAttendeesAndCourses();
                              }
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
                              getAttendeesAndCourses();
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
                          // disabled={pending}
                          options={attendeeOptions}
                          onChange={(value) => {
                            field.onChange(value);
                            filterCourseOptions();
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
                          options={enrolledCoursesOptions}
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

              <div>
                <FormField
                  control={form.control}
                  name="repeat"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={(value) => {
                              if (value) {
                                form.setValue(
                                  "repeatConfig.firstWeekTime",
                                  classDialog.startDate as Date
                                );
                                form.setValue(
                                  "repeatConfig.secondWeekTime",
                                  classDialog.startDate as Date
                                );
                              }
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">Repeat</FormLabel>
                      </div>
                      <FormDescription>Repeat class weekly</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div
                  className={cn(
                    "border px-6 transition-all duration-300 ",
                    form.getValues("repeat")
                      ? "max-h-[400px] opacity-100 mt-4 py-6"
                      : "h-0 opacity-0 overflow-hidden"
                  )}
                >
                  <div>
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                      <FormField
                        control={form.control}
                        name="repeatConfig.repeatSchedule"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Repeat Schedule</FormLabel>
                            <FormControl>
                              <DropdownSelect
                                disabled={isPending}
                                options={repeatOptions}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="repeatConfig.range"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From - To</FormLabel>
                            <FormControl>
                              <DateRangePicker
                                disabled={isPending}
                                date={field.value}
                                setDate={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div
                      className={cn(
                        "transition-all duration-300 flex flex-col gap-4",
                        form.getValues("repeatConfig.repeatSchedule") ===
                          RepeatScheduleType.SHIFTS
                          ? "max-h-[200px] opacity-100 mt-4"
                          : "h-0 opacity-0 overflow-hidden"
                      )}
                    >
                      <FormField
                        control={form.control}
                        name="repeatConfig.firstWeekTime"
                        render={({ field }) => (
                          <FormItem className="flex gap-2 items-center">
                            <FormLabel className="w-32">
                              1st Week Time:
                            </FormLabel>
                            <FormControl>
                              <TimePicker
                                disabled={isPending}
                                date={field.value}
                                setDate={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="repeatConfig.secondWeekTime"
                        render={({ field }) => (
                          <FormItem className="flex gap-2 items-center">
                            <FormLabel className="w-32">
                              2nd Week Time:
                            </FormLabel>
                            <FormControl>
                              <TimePicker
                                disabled={isPending}
                                date={field.value}
                                setDate={(value) => {
                                  field.onChange(value);
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
                </div>
              </div>
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
