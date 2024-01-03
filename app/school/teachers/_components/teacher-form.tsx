"use client";

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
import { CustomPhoneInput } from "@/components/ui/custom-phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { z } from "zod";
import axios, { AxiosResponse } from "axios";
import { Role, User } from "@prisma/client";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import { RoleType } from "@/lib/models/Roles";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TeacherFormProps {
  data?: User | null;
  setDialogOpen?: Dispatch<SetStateAction<boolean>>;
  action?: "edit" | "create";
}

export default function TeacherForm({
  data = undefined,
  setDialogOpen,
  action = "create",
}: TeacherFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [roleOptions, setRoleOptions] = useState<ComboboxOptions[]>([]);
  const router = useRouter();

  let formSchema = z.object({
    firstName: z.string().min(1, "Field is required").min(3, {
      message: "First name is too short",
    }),
    lastName: z.string().min(1, "Field is required").min(3, {
      message: "Last name is too short",
    }),
    email: z.string().min(1, "Field is required").email("Enter a valid email"),
    password: z.string(),
    phone: z.string().min(5, "Field is required"),
    roleId: z.string().min(1, "Field is required"),
  });

  const defValues = data
    ? {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        roleId: data.roleId,
      }
    : {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        roleId: "",
      };

  const makeFieldOptional = (schema: any, fieldName: string) => {
    return schema.extend({
      [fieldName]: schema.shape[fieldName].optional(),
    });
  };

  if (action === "edit") {
    formSchema = makeFieldOptional(formSchema, "password");
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defValues,
  });

  useEffect(() => {
    axios
      .get("/api/roles")
      .then((response: AxiosResponse<Role[]>) => {
        const options = response.data.map((role) => ({
          label: role.type === RoleType.ADMIN ? "Admin" : "Teacher",
          value: role.id,
        }));
        setRoleOptions(options);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleResetPassword() {
    axios
      .patch("/api/auth/register/reset-password", {
        teacherId: data?.id,
        password: newPassword,
      })
      .then((response: AxiosResponse<User[]>) => {
        if (response.status === 200) {
          router.refresh();
          toast.success("Password has been reset.", {
            description: `${data?.firstName} ${data?.lastName}`,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setPending(false);
      });
    setNewPassword("");
    setIsPopoverOpen(false);
  }

  function createTeacher(values: z.infer<typeof formSchema>) {
    setPending(true);
    axios
      .post("/api/auth/register/teachers", { ...values })
      .then((response: AxiosResponse<User[]>) => {
        if (response.status === 201) {
          router.refresh();
          toast.success("Teacher has been updated", {
            description: `${values.firstName} ${values.lastName}`,
          });
        }
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
      .patch("/api/auth/register/teachers/" + data?.id, { ...values })
      .then((response: AxiosResponse<User[]>) => {
        if (response.status === 200) {
          router.refresh();
          toast.success("Teacher has been updated", {
            description: `${values.firstName} ${values.lastName}`,
          });
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

    action === "create" ? createTeacher(values) : updateTeacher(values);
  }

  return (
    <div className="grid gap-4">
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

          {action === "create" && (
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
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <DropdownSelect
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

            <Popover
              open={isPopoverOpen}
              onOpenChange={() => setIsPopoverOpen((current) => !current)}
            >
              <PopoverTrigger asChild>
                {action === "edit" && (
                  <Button
                    disabled={pending}
                    className="!mt-6 mr-auto pl-0"
                    variant="link"
                  >
                    Reset Password
                  </Button>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <p className="pb-2 text-sm font-medium">New Password</p>
                <Input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  placeholder="Enter new password..."
                ></Input>
                <div className="flex justify-end mt-4">
                  <Button className="ml-auto" onClick={handleResetPassword}>
                    Reset
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              disabled={pending || !form.formState.isDirty}
              className="!mt-6"
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
          </div>
        </form>
      </Form>
    </div>
  );
}
