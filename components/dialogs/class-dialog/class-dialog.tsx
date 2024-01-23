"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useClassDialog } from "@/hooks/useClassDialog";
import { ClassType } from "@/lib/models/class-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import axios from "axios";
import LinearLoader from "@/components/ui/linear-loader";
import { cn } from "@/lib/utils";
import { RepeatScheduleType } from "@/lib/models/repeat-schedule";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addDays } from "date-fns";

const formSchema = z
  .object({
    type: z.string().min(1, "Field is required"),
    startDate: z.date({
      required_error: "Field is required.",
    }),
    duration: z.string().min(1, "Field is required"),
    courseId: z.string().min(1, "Field is required"),
    attendeeId: z.string().min(1, "Field is required"),
    classroomId: z.string().min(1, "Field is required"),
    originalTeacherId: z.string(),
    substitute: z.boolean(),
    repeat: z.boolean(),
    repeatConfig: z.object({
      repeatSchedule: z.string().min(1, "Field is required"),
      // fromTo: z.date({
      //   required_error: "Field is required.",
      // }),
      range: z.object({
        from: z.date(),
        to: z.date(),
      }),
      // to: z.date({
      //   required_error: "Field is required.",
      // }),
      // firstWeekTime: z.string(),
      // secondWeekTime: z.string(),
    }),
  })
  .refine((data) => !data.substitute || data.originalTeacherId, {
    path: ["originalTeacherId"],
    message: "Fields is required",
  });
// .refine((data) => !data.repeat || (data.repeat && data.repeatConfig), {
//   path: ["repeatConfig"],
//   message: "Repeat configuration is required when 'repeat' is true",
// });

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
  const [coursesOptions, setCoursesOptions] = useState([]);
  const [courses, setCourses] = useState([]);

  const classDialog = useClassDialog();

  const defaultValues = {
    type: ClassType.STUDENT,
    duration: "60",
    courseId: "",
    attendeeId: "",
    classroomId: classDialog.classroom,
    originalTeacherId: "",
    substitute: false,
    repeat: false,
    repeatConfig: {
      repeatSchedule: RepeatScheduleType.SAME_TIME,
      range: {
        from: new Date(),
        to: addDays(new Date(), 30),
      },
      // firstWeekTime: "12:00",
      // secondWeekTime: "18:00",
    },
  };

  console.log("defaultValues :>> ", defaultValues);

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
    setTimeout(() => {
      form.reset();
    }, 200);
  }, [classDialog, form]);

  const getStudents = useCallback(
    (teacherId?: string): void => {
      form.setValue("courseId", "");
      form.setValue("attendeeId", "");
      setIsFetching(true);

      axios
        .get("/api/students/", {
          params: teacherId ? { substituteTeacher: teacherId } : null,
        })
        .then((response: any) => {
          setAttendeeOptions(response.data);
          console.log("students", response.data);
        })
        .catch((error: any) => {
          toast.error("Something went wrong. Note wasn't added!");
        })
        .finally(() => setIsFetching(false));
    },
    [form, setAttendeeOptions]
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
          setCourses(response.data);
          console.log("courses", response.data);
        })
        .catch((error: any) => {
          toast.error("Something went wrong. Note wasn't added!");
        })
        .finally(() => setIsFetching(false));
    },
    [setAttendeeOptions]
  );

  const getGroups = useCallback(
    (teacherId?: string): void => {
      form.setValue("courseId", "");
      form.setValue("attendeeId", "");
      setIsFetching(true);

      axios
        .get("/api/groups/", {
          params: teacherId ? { substituteTeacher: teacherId } : null,
        })
        .then((response: any) => {
          setAttendeeOptions(response.data);
          console.log("students", response.data);
        })
        .catch((error: any) => {
          toast.error("Something went wrong. Note wasn't added!");
        })
        .finally(() => setIsFetching(false));
    },
    [form, setAttendeeOptions]
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
          setCourses(response.data);
          console.log("courses", response.data);
        })
        .catch((error: any) => {
          toast.error("Something went wrong. Note wasn't added!");
        })
        .finally(() => setIsFetching(false));
    },
    [setAttendeeOptions]
  );

  const filterCourseOptions = useCallback(() => {
    const atendeeId = form.getValues("attendeeId");
    // @ts-ignore
    const options = courses.find((course) => course.atendeeId === atendeeId);
    // @ts-ignore
    setCoursesOptions(options?.courses);
  }, [courses, form]);

  const getAttendeesAndCourses = useCallback(() => {
    const classType = form.getValues("type");
    const isSubstitute = form.getValues("substitute");
    const originalTeacherId = form.getValues("originalTeacherId");

    console.log("classType :>> ", classType);
    console.log("isSubstitute :>> ", isSubstitute);
    console.log("originalTeacherId :>> ", originalTeacherId);

    if (classType === ClassType.STUDENT) {
      getStudents(originalTeacherId);
      getStudentEnrollments(originalTeacherId);
    } else {
      getGroups(originalTeacherId);
      getGroupEnrollments(originalTeacherId);
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
  }, []);

  // function getStudentEnrollments(teacherId?: string): void {
  //   if (teacherId) {
  //     setAttendeeOptions([]);
  //   }
  //   axios
  //     .get("/api/students/enrollments", {
  //       params: teacherId ? { substituteTeacher: teacherId } : null,
  //     })
  //     .then((response: any) => {
  //       setCourses(response.data);
  //       console.log("courses", response.data);
  //     })
  //     .catch((error: any) => {
  //       toast.error("Something went wrong. Note wasn't added!");
  //     });
  // }

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
      <DialogContent className="max-h-screen overflow-y-auto overflow-x-hidden">
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
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <DateTimePicker
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
                            checked={field.value}
                            onCheckedChange={(value) => {
                              // if substitute is false fetch students for current (logged in) teacher
                              if (!value) {
                                form.setValue("originalTeacherId", "");
                                getAttendeesAndCourses();
                                // getStudents();
                                // getStudentEnrollments();
                                // filterCourseOptions();
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
                    name="originalTeacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Teacher</FormLabel>
                        <FormControl>
                          <DropdownSelect
                            options={teachers}
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
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      <FormLabel>Course</FormLabel>
                      <FormControl>
                        <DropdownSelect
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
                      <FormLabel>Classroom {field.value}</FormLabel>
                      <FormControl>
                        <DropdownSelect
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
                            checked={field.value}
                            onCheckedChange={field.onChange}
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
                      {/* <FormField
                        control={form.control}
                        name="repeatConfig.firstWeekTime"
                        render={({ field }) => (
                          <FormItem className="flex gap-2 items-center">
                            <FormLabel className="w-32">
                              1st Week Time:
                            </FormLabel>
                            <FormControl>
                              <TimePicker
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
                                date={field.value}
                                setDate={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                            <FormDescription></FormDescription>
                          </FormItem>
                        )}
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 gap-4 sm:gap-0">
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
