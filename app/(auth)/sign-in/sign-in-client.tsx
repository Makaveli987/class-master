"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().min(1, "Field is required").email("Enter a valid email"),
  password: z.string().min(1, "Field is required"),
});

export default function SignInClient() {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // Redirect to home if already signed in
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  if (session) {
    // Optionally render null or a loading indicator while redirecting
    return null;
  }

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setPending(true);
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl: "/school",
    })
      .catch((err) => console.log(err))
      .finally(() => setPending(false));
  }

  return (
    <div className="mx-auto bg-white w-[400px] p-10 shadow-sm border rounded-lg">
      <div className="flex flex-col space-y-1 mb-8">
        <h3 className="font-semibold tracking-tight text-2xl">
          Log into your account
        </h3>
        <div className="flex text-sm">
          <p className="text-muted-foreground">
            New to ClassMaster?{" "}
            <Link className="text-primary font-medium" href="/sign-up">
              Sign up for an account
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
          <Button disabled={pending} className="w-full !mt-10" type="submit">
            {pending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Logging In
              </>
            ) : (
              <>Login</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
