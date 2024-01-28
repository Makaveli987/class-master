"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2Icon, PlusCircleIcon, User } from "lucide-react";
import { useEffect, useState } from "react";
import { DialogAction } from "@/lib/models/dialog-actions";
import useTeacherDialog from "@/hooks/use-teacher-dialog";
import { CustomPhoneInput } from "@/components/ui/custom-phone-input";
import { DatePicker } from "@/components/ui/date-picker";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { roleOptions } from "@/lib/models/role";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

export default function TeacherDialog() {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const teacherDialog = useTeacherDialog();

  let formSchema = z.object({
    firstName: z.string().min(1, "Field is required").min(3, {
      message: "First name is too short",
    }),
    lastName: z.string().min(1, "Field is required").min(3, {
      message: "Last name is too short",
    }),
    email: z.string().min(1, "Field is required").email("Enter a valid email"),
    password: z.string(),
    dateOfBirth: z.date({ required_error: "Field is required" }),
    phone: z.string().min(5, "Field is required"),
    role: z.string().min(1, "Field is required"),
  });

  const defValues = teacherDialog?.data
    ? {
        firstName: teacherDialog.data.firstName,
        lastName: teacherDialog.data.lastName,
        email: teacherDialog.data.email,
        phone: teacherDialog.data.phone,
        role: teacherDialog.data.role,
        dateOfBirth: teacherDialog.data.dateOfBirth,
      }
    : {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        role: "",
      };

  const makeFieldOptional = (schema: any, fieldName: string) => {
    return schema.extend({
      [fieldName]: schema.shape[fieldName].optional(),
    });
  };

  if (teacherDialog.action === DialogAction.EDIT) {
    formSchema = makeFieldOptional(formSchema, "password");
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const defValues = teacherDialog?.data
      ? {
          firstName: teacherDialog.data.firstName,
          lastName: teacherDialog.data.lastName,
          email: teacherDialog.data.email,
          phone: teacherDialog.data.phone,
          role: teacherDialog.data.role,
          dateOfBirth: teacherDialog.data.dateOfBirth,
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
          role: "",
        };
    form.reset(defValues);
  }, [teacherDialog.data, form]);

  function createTeacher(values: z.infer<typeof formSchema>) {
    setPending(true);
    axios
      .post("/api/auth/register/teachers", { ...values })
      .then((response) => {
        if (response.status === 201) {
          router.refresh();
          toast.success("Teacher has been updated", {
            description: `${values.firstName} ${values.lastName}`,
          });
        }
        teacherDialog.close();
      })
      .catch((error) => {
        toast.error("Something went wrong. Teacher wasn't updated!", {
          description: `${values.firstName} ${values.lastName}`,
        });
      })
      .finally(() => {
        setPending(false);
      });
  }

  function updateTeacher(values: z.infer<typeof formSchema>) {
    setPending(true);
    axios
      .patch("/api/auth/register/teachers/" + teacherDialog.data?.id, {
        ...values,
      })
      .then((response) => {
        if (response.status === 200) {
          router.refresh();
          toast.success("Teacher has been updated", {
            description: `${values.firstName} ${values.lastName}`,
          });
          teacherDialog.close();
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Teacher wasn't updated!", {
          description: `${values.firstName} ${values.lastName}`,
        });
        console.error(error);
      })
      .finally(() => setPending(false));
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    formSchema.parse(values);

    teacherDialog.action === DialogAction.CREATE
      ? createTeacher(values)
      : updateTeacher(values);
  }
  return (
    <Dialog
      open={teacherDialog.isOpen}
      onOpenChange={() => {
        if (teacherDialog.isOpen) {
          teacherDialog.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-6">
            {teacherDialog.action === DialogAction.CREATE
              ? "Add Teacher"
              : "Edit Teacher"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      placeholder="First name"
                      {...field}
                    />
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
                    <Input
                      disabled={pending}
                      placeholder="Last name"
                      {...field}
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

            {teacherDialog.action === DialogAction.CREATE && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={pending}
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <DropdownSelect
                      placeholder="Select role..."
                      disabled={pending}
                      options={roleOptions}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pb-2">
              <Button
                disabled={pending}
                type="reset"
                onClick={() => {
                  teacherDialog.close();
                }}
                variant="outline"
              >
                Close
              </Button>

              <Button
                disabled={pending || !form.formState.isDirty}
                type="submit"
              >
                {pending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>Save</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
