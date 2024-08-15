"use client";
import { sendEmailFromContact } from "@/actions/send-contact-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MaxWidthWrapper from "./max-width-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

export const contactSchema = z.object({
  fullName: z.string().min(1, "Field is required"),
  email: z.string().min(1, "Field is required").email("Enter a valid email"),
  message: z.string().min(1, "Field is required"),
});

export default function Contact() {
  0;
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setIsPending(true);
    console.log("values: ", values);

    // await sendEmailFromContact(
    //   values.fullName,
    //   values.email,
    //   values.message
    // ).finally(() => setIsPending(false));
  }

  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-accent">
      <MaxWidthWrapper>
        <div className="container grid items-center gap-8 px-0 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Kontaktirajte nas
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-lg/relaxed">
                Za više informacija o aplikaciji i potencijalnu saradnju
                kontaktirajte nas e-mail: info@classmaster.com ili pomoću
                kontakt forme i odgovorićemo Vam u najkraćem mogućem vremenu.
              </p>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ime i prezime</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-card"
                          id="name"
                          disabled={isPending}
                          placeholder="Unesite Vaše ime"
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
                          className="bg-card"
                          id="name"
                          disabled={isPending}
                          placeholder="Unesite Vaš email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poruka</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[120px] bg-card"
                        id="message"
                        disabled={isPending}
                        placeholder="Unesite Vašu poruku"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    Slanje poruke
                  </>
                ) : (
                  "Pošalji poruku"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
