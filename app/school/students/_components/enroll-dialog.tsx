"use client";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Course, Enrollment, User } from "@prisma/client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { string, z } from "zod";
import axios, { AxiosResponse } from "axios";
import router from "next/router";
import { useRouter } from "next/navigation";

interface EnrollDialogProps {
  children?: React.ReactNode;
  courses?: Course[] | null;
  studentId: string;
}

interface IEnrollment {
  courseId: string;
  teacherId: string;
  studentId: string;
  goals: string;
}

const formSchema = z.object({
  courseId: z.string().min(1, "Field is required").min(3, {
    message: "First name is too short",
  }),
  teacherId: z.string().min(1, "Field is required").min(3, {
    message: "Last name is too short",
  }),
  goals: z.string(),
});

export default function EnrollStudentDialog({
  children,
  studentId,
  courses,
}: EnrollDialogProps) {
  const [courseOptions, setCoursesOptions] = useState<ComboboxOptions[]>([]);
  const [teachersOptions, setTeachersOptions] = useState<ComboboxOptions[]>([]);

  const router = useRouter();

  const defValues = {
    courseId: "",
    teacherId: "",
    goals: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defValues,
  });

  useEffect(() => {
    console.log("courses", courses);
    const cOptions = courses?.map((course: Course) => ({
      value: course.id,
      label: course.name,
    }));
    setCoursesOptions(cOptions || []);
  }, []);

  function createEnrollment(values: IEnrollment) {
    axios
      .post("/api/enrollment", { ...values })
      .then((response: AxiosResponse<Enrollment[]>) => {
        if (response.status === 201) {
          router.refresh();
          toast.success("Student successfully enrolled.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Teacher wasn't enrolled!");
      });
  }

  // function updateTeacher(values: z.infer<typeof formSchema>) {
  //   setPending(true);
  //   axios
  //     .patch("/api/auth/register/teachers/" + data?.id, { ...values })
  //     .then((response: AxiosResponse<User[]>) => {
  //       if (response.status === 200) {
  //         router.refresh();
  //         toast.success("Teacher has been updated", {
  //           description: `${values.firstName} ${values.lastName}`,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error("Something went wrong. Teacher wasn't updated!", {
  //         description: `${values.firstName} ${values.lastName}`,
  //       });
  //       console.error(error);
  //     })
  //     .finally(() => setPending(false));
  // }

  function onSubmit(values: z.infer<typeof formSchema>) {
    createEnrollment({ ...values, studentId });
    // action === "create" ? createTeacher(values) : updateTeacher(values);
  }

  return (
    <Dialog
      onOpenChange={() => {
        setTimeout(() => {
          form.reset();
        }, 100);
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enroll Student</DialogTitle>
          <DialogDescription>
            Select the course and teacher for the student
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 mt-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <DropdownSelect
                        options={courseOptions}
                        onChange={(value) => {
                          const selectedCourse = courses?.find(
                            (course) => course.id === value
                          );
                          // @ts-ignore
                          const tOptions = selectedCourse?.userPerCourses?.map(
                            (item: any) => ({
                              value: item.user?.id,
                              label: `${item.user?.firstName} ${item.user?.lastName}`,
                            })
                          );
                          setTeachersOptions(tOptions);
                          field.onChange(value);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <FormControl>
                      <DropdownSelect
                        disabled={!form.getValues().courseId}
                        options={teachersOptions}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-32"
                        placeholder="Type the goals here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button asChild variant="outline">
                  <DialogClose>Cancel</DialogClose>
                </Button>
                <DialogClose>
                  <Button type="submit">Enroll</Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
