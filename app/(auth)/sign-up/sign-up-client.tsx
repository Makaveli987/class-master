"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Separator } from "@/components/ui/separator";
import { genderOptions } from "@/lib/models/gender";
import { RoleType } from "@/lib/models/role";
import { User } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const formSchema = z.object({
  firstName: z.string().min(1, "Field is required").min(3, {
    message: "First name is too short",
  }),
  lastName: z.string().min(1, "Field is required").min(3, {
    message: "Last name is too short",
  }),
  email: z.string().min(1, "Field is required").email("Enter a valid email"),
  password: z.string().min(1, "Field is required"),
  phone: z.string().min(5, "Field is required"),
  dateOfBirth: z.date({ required_error: "Field is required" }),
  gender: z.string().min(1, "Field is required"),
  schoolName: z.string().min(1, "Field is required").min(3, {
    message: "School name must be at least 3 characters long.",
  }),
});

const SignUpClient = () => {
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
      schoolName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);
    axios
      .post("/api/auth/register", { ...values, role: RoleType.ADMIN })
      .then((response: AxiosResponse<User>) => {
        if (response.status === 201) {
          signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: "/school/calendar",
          }).finally(() => setPending(false));
        }
      })
      .catch((error) => {
        setPending(false);

        console.error(error);
      });
  }

  return (
    <div className="bg-card text-card-foreground w-[500px] p-10 shadow-sm border rounded-lg">
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold tracking-tight text-2xl">
          Create an account
        </h3>
        <div className="flex text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link className="text-primary font-medium" href="/sign-in">
              Sign in
            </Link>
            .
          </p>
        </div>
      </div>
      <Separator className="my-6" />
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <DropdownSelect
                    disabled={pending}
                    options={genderOptions}
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
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School name</FormLabel>
                <FormControl>
                  <Input
                    disabled={pending}
                    placeholder="School name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={pending} className="w-full !mt-10" type="submit">
            {pending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Signing Up
              </>
            ) : (
              <>Sign Up</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpClient;
