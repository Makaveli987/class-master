"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { CustomPhoneInput } from "@/components/ui/custom-phone-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Student } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

const formSchema = z.object({
  firstName: z.string().min(1, "Field is required").min(3, {
    message: "First name is too short",
  }),
  lastName: z.string().min(1, "Field is required").min(3, {
    message: "Last name is too short",
  }),
  email: z.string().min(1, "Field is required").email("Enter a valid email"),
  phone: z.string().min(5, "Field is required"),
  // course: z.string().min(1, "Field is required"),
});

// const options = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit ",
//     label: "SvelteKit SvelteKitSvelteKit  ",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
// ];

export default function StudentDialog() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      // course: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);
    console.log({ values });
    setOpen(false);

    axios
      .post("/api/students", { ...values })
      .then((response: AxiosResponse<Student[]>) => {
        if (response.status === 201) {
          toast.success("Student has been created", {
            description: `${values.firstName} ${values.lastName}`,
          });
          form.reset();
        }
        revalidatePath("/school/students");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setPending(false));
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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

              {/* <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Combobox
                        options={options}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <div className="flex items-center justify-end gap-2">
                <Button
                  disabled={pending}
                  type="reset"
                  onClick={() => {
                    form.reset();
                    setOpen(false);
                  }}
                  className="!mt-6 "
                  variant="outline"
                >
                  Close
                </Button>
                <Button disabled={pending} className="!mt-6" type="submit">
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
      </DialogContent>
    </Dialog>
  );
}
