"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CustomPhoneInput } from "@/components/ui/custom-phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import axios, { AxiosResponse } from "axios";
import { Student } from "@prisma/client";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(1, "Field is required").min(3, {
    message: "First name is too short",
  }),
  lastName: z.string().min(1, "Field is required").min(3, {
    message: "Last name is too short",
  }),
  email: z.string().min(1, "Field is required").email("Enter a valid email"),
  phone: z.string().min(5, "Field is required"),
});

interface StudentFormProps {
  data?: Student | null;
  setDialogOpen?: Dispatch<SetStateAction<boolean>>;
  action?: "edit" | "create";
}

export default function StudentForm({
  data,
  setDialogOpen,
  action = "create",
}: StudentFormProps) {
  const [pending, setPending] = useState(false);

  const defValues = data
    ? {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
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

  function createUser(values: z.infer<typeof formSchema>) {
    axios
      .post("/api/students", { ...values })
      .then((response: AxiosResponse<Student[]>) => {
        if (response.status === 201) {
          toast.success("Student has been created", {
            description: `${values.firstName} ${values.lastName}`,
          });
          form.reset();
          setDialogOpen?.(false);
        }
        revalidatePath("/school/students");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setPending(false));
  }

  function updateUser(values: z.infer<typeof formSchema>) {
    axios
      .patch("/api/students/" + data?.id, { ...values })
      .then((response: AxiosResponse<Student[]>) => {
        if (response.status === 201) {
          toast.success("Student has been updated", {
            description: `${values.firstName} ${values.lastName}`,
          });
        }
        revalidatePath("/school/students");
        revalidatePath(`/school/students/${data?.id}`);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setPending(false));
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);

    action === "create" ? createUser(values) : updateUser(values);
  }

  return (
    <div className="grid gap-4 mt-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={action === "create" ? "space-y-4" : "space-y-6"}
        >
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

          <div className="flex items-center justify-end gap-2">
            {action === "create" && (
              <Button
                disabled={pending}
                type="reset"
                onClick={() => {
                  form.reset();
                  setDialogOpen?.(false);
                }}
                className="!mt-6 "
                variant="outline"
              >
                Close
              </Button>
            )}

            <Button
              disabled={pending || !form.formState.isDirty}
              className="!mt-6"
              type="submit"
            >
              {pending ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Save
                </>
              ) : (
                <>Save</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
