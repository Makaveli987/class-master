import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MailSearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

type EmailVerificationDialogProps = {
  isOpen: boolean;
};

export function EmailVerificationDialog({
  isOpen,
}: EmailVerificationDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <DialogContent className="sm:max-w-[475px] p-16">
        <div className="flex flex-col gap-4 items-center justify-center">
          <MailSearchIcon className="w-9 h-9 text-primary" />

          <h3
            className="text-lg font-medium leading-6 capitalize bg-card"
            id="modal-title"
          >
            Check your email
          </h3>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Your email address is not yet verified. We&apos;ve sent a
            verification link to your inbox.
          </p>
        </div>

        <Button
          onClick={() => setOpen(false)}
          className="mx-auto"
          variant={"ghost"}
          type="submit"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
