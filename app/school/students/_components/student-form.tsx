"use client";

import { Button } from "@/components/ui/button";
import { CustomPhoneInput } from "@/components/ui/custom-phone-input";
import { DatePicker } from "@/components/ui/date-picker";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import useStudentDialog from "@/hooks/use-student-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Student } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "Field is required").min(3, {
    message: "First name is too short",
  }),
  lastName: z.string().min(1, "Field is required").min(3, {
    message: "Last name is too short",
  }),
  dateOfBirth: z.date({ required_error: "Field is required" }),

  email: z.string().min(1, "Field is required").email("Enter a valid email"),
  phone: z.string().min(5, "Field is required"),
});

export default function StudentForm() {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const studentDialog = useStudentDialog();

  const defValues = studentDialog.data
    ? {
        firstName: studentDialog.data.firstName,
        lastName: studentDialog.data.lastName,
        email: studentDialog.data.email,
        phone: studentDialog.data.phone,
        dateOfBirth: studentDialog.data.dateOfBirth,
      }
    : {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defValues,
  });

  function createStudent(values: z.infer<typeof formSchema>) {
    axios
      .post("/api/students", { ...values })
      .then((response: AxiosResponse<Student[]>) => {
        if (response.status === 201) {
          toast.success("Student has been created", {
            description: `${values.firstName} ${values.lastName}`,
          });
          form.reset();
          studentDialog.close();
          router.refresh();
          // setDialogOpen?.(false);
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Student wasn't created!", {
          description: `${values.firstName} ${values.lastName}`,
        });
        console.error(error);
      })
      .finally(() => setPending(false));
  }

  function updateStudent(values: z.infer<typeof formSchema>) {
    axios
      .patch("/api/students/" + studentDialog.data?.id, { ...values })
      .then((response: AxiosResponse<Student[]>) => {
        if (response.status === 200) {
          toast.success("Student has been updated", {
            description: `${values.firstName} ${values.lastName}`,
          });
          studentDialog.close();
          router.refresh();
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Student wasn't updated!", {
          description: `${values.firstName} ${values.lastName}`,
        });
        console.error(error);
      })
      .finally(() => setPending(false));
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);
    // console.log("values", values);
    studentDialog.action === DialogAction.CREATE
      ? createStudent(values)
      : updateStudent(values);
  }

  return (
    // <div className="grid gap-4">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input disabled={pending} placeholder="First name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input disabled={pending} placeholder="Last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  disabled={pending}
                  setDate={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={pending}
                  type="email"
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <CustomPhoneInput
                  disabled={pending}
                  placeholder="Phone number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex pt-4 flex-col-reverse sm:flex-row sm:items-center sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
          <Button
            disabled={pending}
            type="reset"
            onClick={(e) => {
              e.preventDefault();
              form.reset();

              studentDialog.close();
            }}
            variant="outline"
          >
            Close
          </Button>

          <Button disabled={pending || !form.formState.isDirty} type="submit">
            {pending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
