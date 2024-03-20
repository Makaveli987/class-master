"use client";
import { login } from "@/actions/auth/login";
import { EmailVerificationDialog } from "@/components/dialogs/verify-email-dialog/verify-email-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const INVALID_CREDENTIALS = "CredentialsSignin";

export default function SignInClient() {
  const [pending, setPending] = useState(false);
  const [isDialogOpen, setisDialogOpen] = useState(false);
  const params = useSearchParams();
  const router = useRouter();

  const error = params.get("error");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setPending(true);
    // await signIn("credentials", {
    //   email: values.email,
    //   password: values.password,
    //   redirectTo: DEFAULT_LOGIN_REDIRECT,
    // }).catch((err) => {
    //   if (err === "AuthorizedCallbackError") {
    //     router.push("verify-account");
    //   }
    // });
    await login(values)
      .then((res) => {
        console.log("res", res);
        if (res?.error) {
          console.log("error", error);
          setisDialogOpen(true);
          // router.push("/verify-account");
        }
      })
      .catch((err) => console.log("err", err))
      .finally(() => setPending(false));
  }

  return (
    <div className="mx-auto bg-card text-card-foreground w-[400px] p-10 shadow-sm border rounded-lg">
      <EmailVerificationDialog isOpen={isDialogOpen} />
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
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-4 w-4" />
                {error === INVALID_CREDENTIALS
                  ? "Invalid credentials"
                  : "Something went wrong"}
              </AlertDescription>
            </Alert>
          )}
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
