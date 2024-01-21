"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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

const formSchema = z
  .object({
    type: z.string().min(1, "Field is required"),
    startDate: z.date({
      required_error: "A date of birth is required.",
    }),
    duration: z.string().min(1, "Field is required"),
    courseId: z.string().min(1, "Field is required"),
    attendeeId: z.string().min(1, "Field is required"),
    classroomId: z.string().min(1, "Field is required"),
    originalTeacherId: z.string(),
    substitute: z.boolean(),
  })
  .refine((data) => !data.substitute || data.originalTeacherId, {
    path: ["originalTeacherId"],
    message: "Fields is required",
  });

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
  const router = useRouter();

  const defaultValues = {
    type: ClassType.STUDENT,
    duration: "60",
    courseId: "",
    attendeeId: "",
    classroomId: "",
    originalTeacherId: "",
    substitute: false,
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
    setTimeout(() => {
      form.reset();
    }, 200);
  }, [classDialog.isOpen, form]);

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

  return (
    <Dialog
      open={classDialog.isOpen}
      onOpenChange={() => {
        if (classDialog.isOpen) {
          classDialog.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add Class</DialogTitle>
        </DialogHeader>
        <div className="h-1.5">{isFetching && <LinearLoader />}</div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-2"
          >
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
                    <FormLabel className="cursor-pointer">Substitute</FormLabel>
                  </div>
                  <FormDescription>
                    Select if you are a substitute teacher
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.getValues("substitute") && (
              <FormField
                control={form.control}
                name="originalTeacherId"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      <FormLabel>Original Teacher</FormLabel>
                      <FormControl>
                        <DropdownSelect
                          options={teachers}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);

                            const classType = form.getValues("type");
                            getAttendeesAndCourses();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription></FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

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
