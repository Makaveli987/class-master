"use client";
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
  enrollmentId: string;
  buttonType: "icon" | "button";
}

export const DeleteEnrollmentButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, enrollmentId, buttonType, asChild = false, ...props }, ref) => {
  const router = useRouter();
  function onDelete() {
    axios
      .delete(`/api/enrollment/${enrollmentId}`)
      .then(() => {
        toast.success("Enrollment has been archived");
        router.refresh();
      })
      .catch(() =>
        toast.error("Something bad happend. Enrollment has not been archived!")
      );
  }

  return (
    <ConfirmDialog
      description="This action will archive the enrollment. You will not be able to assign students and classes to this enrollment."
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
                Delete Enrollment
              </Button>
            )}
          </>
        </Tooltip2>
      </div>
    </ConfirmDialog>
  );
});
DeleteEnrollmentButton.displayName = "DeleteEnrollmentButton";
