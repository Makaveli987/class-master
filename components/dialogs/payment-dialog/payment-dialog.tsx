"use client";
import { createPayment } from "@/actions/payments/create-payment";
import { getStudentsOptions } from "@/actions/students/get-students-options";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import { CustomCurrencyInput } from "@/components/ui/currency-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePaymentDialog } from "@/hooks/use-payment-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  userId: z.string().min(1, "Field is required"),
  amount: z.number().min(1, "Field is required"),
});

export default function PaymenDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [studentOptions, setStudentOptions] = useState<ComboboxOptions[]>([]);

  const paymentDialog = usePaymentDialog();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    console.log("paymentDialog", paymentDialog);
    if (paymentDialog.shouldShowStudents) {
      getStudentsOptions(paymentDialog.userId)
        .then((res) => {
          if (res.error) {
            toast.error(res.error);
          }
          setStudentOptions(res.data);
        })
        .catch(() => toast.error("Something went wrong"));
    } else {
      form.setValue("userId", paymentDialog.userId || "");
      setStudentOptions([]);
    }
  }, [
    form,
    paymentDialog,
    paymentDialog.shouldShowStudents,
    paymentDialog.userId,
  ]);

  async function create(values: z.infer<typeof formSchema>) {
    // Get student name if we  are showing students list
    const userName = paymentDialog.shouldShowStudents
      ? studentOptions.find((s) => s.value === values.userId)?.label
      : paymentDialog.userName;

    setIsPending(true);
    await createPayment({
      ...values,
      userName: userName || paymentDialog.userName,
      enrollmentId: paymentDialog.enrollmentId,
    })
      .then(() => {
        toast.success("Payment successfull.");
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => {
        setIsPending(false);
        form.reset();
        paymentDialog.close();
      });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // setIsPending(true);
    // !!noteDialog.data ? updateNote(values) : createNote(values);
    console.log("submit ");
    create(values);
  }

  function onErrors(errors: any) {
    console.log("Validation errors: ", errors);
  }

  return (
    <Dialog
      open={paymentDialog.isOpen}
      onOpenChange={() => {
        if (paymentDialog.isOpen) {
          paymentDialog.close();
          form.reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {/* {!!paymentDialog.data ? "Edit Note" : "Add Note"} */}
            New Payment
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onErrors)}
            className="space-y-6 mt-2"
          >
            {paymentDialog.shouldShowStudents && (
              <FormField
                control={form.control}
                name="userId"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      <FormLabel>Student</FormLabel>
                      <FormControl>
                        <Combobox
                          disabled={isPending}
                          placeholder="Select student..."
                          value={field.value}
                          options={studentOptions || []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <CustomCurrencyInput
                      placeholder="Enter an  amount..."
                      disabled={isPending}
                      allowNegativeValue={false}
                      value={field.value}
                      onValueChange={(value, name, values) => {
                        field.onChange(values?.float);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  paymentDialog.close();
                  form.reset();
                }}
              >
                Cancel
              </Button>

              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
