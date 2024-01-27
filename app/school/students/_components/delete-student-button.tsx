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
  studentId?: string;
  buttonType: "icon" | "button";
}

export const DeleteStudentButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, studentId, buttonType, asChild = false, ...props }, ref) => {
  const router = useRouter();
  function onDelete() {
    axios
      .delete(`/api/students/${studentId}`)
      .then(() => {
        toast.success("Student has been archived");
        router.refresh();
      })
      .catch(() =>
        toast.error("Something bad happend. Group has not been archived!")
      );
  }

  return (
    <ConfirmDialog
      description="This action will archive the student. You will not be able to assign students and classes to this student."
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
                Delete Student
              </Button>
            )}
          </>
        </Tooltip2>
      </div>
    </ConfirmDialog>
  );
});
DeleteStudentButton.displayName = "DeleteStudentButton";
