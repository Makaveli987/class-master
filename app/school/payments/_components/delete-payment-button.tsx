"use client";
import { deletePayment } from "@/actions/payments/delete-payment";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Tooltip2 } from "@/components/ui/tooltip2";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  paymentId: string;
  buttonType: "icon" | "button";
}

export const DeletePaymentButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, paymentId, buttonType, asChild = false, ...props }, ref) => {
  const router = useRouter();
  async function onDelete() {
    await deletePayment(paymentId)
      .then(() => {
        toast.success("Payment has been deleted");
        router.refresh();
      })
      .catch(() =>
        toast.error("Something bad happend. Payment was not deleted!")
      );
  }

  return (
    <ConfirmDialog
      description="This action will delete this payment. You will not be able to revert it."
      onConfirm={onDelete}
    >
      <div>
        <Tooltip2 text="Delete" side="top">
          <>
            {buttonType === "icon" && (
              <Button variant="ghost" className="h-8 w-8 p-0 group">
                <Trash2Icon className="w-4 h-4 text-muted-foreground group-hover:text-rose-600" />
              </Button>
            )}

            {buttonType === "button" && (
              <Button variant="ghost-destructive">
                <Trash2Icon className="h-4 w-4 mr-2" />
                Delete Payment
              </Button>
            )}
          </>
        </Tooltip2>
      </div>
    </ConfirmDialog>
  );
});
DeletePaymentButton.displayName = "DeletePaymentButton";
