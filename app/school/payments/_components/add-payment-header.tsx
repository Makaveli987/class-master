"use client";

import { Button } from "@/components/ui/button";
import { usePaymentDialog } from "@/hooks/use-payment-dialog";
import { PlusCircleIcon } from "lucide-react";
import React from "react";

type AddPaymentHeaderProps = {
  enrollmentId: string;
  userId: string | null;
  userName: string | null;
  shouldShowStudents: boolean;
};

export default function AddPaymentHeader({
  enrollmentId,
  userId,
  userName,
  shouldShowStudents = false,
}: AddPaymentHeaderProps) {
  const paymentDialog = usePaymentDialog();

  return (
    <div className="space-y-1.5 pt-10 pb-6 px-2 mb-3 flex flex-row max-w-5xl">
      <div className="space-y-1.5">
        <h3 className="font-semibold leading-none tracking-tight">
          Payment History
        </h3>
        <p className="text-sm text-muted-foreground">
          All payments for this enrollment
        </p>
      </div>
      <Button
        className="ml-auto"
        onClick={() =>
          paymentDialog.open({
            enrollmentId,
            userId: userId || "",
            userName: userName || "",
            shouldShowStudents,
          })
        }
      >
        <PlusCircleIcon className="w-5 h-5 mr-2" />
        New Payment
      </Button>
    </div>
  );
}
