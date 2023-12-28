"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useConfirmDialog from "@/hooks/use-confirm-dialog";

interface ConfirmDialogProps {
  children?: React.ReactNode;
  title?: string;
  description: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  children,
  title = "Are you absolutely sure?",
  description,
  onConfirm,
}: ConfirmDialogProps) {
  //   const [open, setOpen] = useState(false);
  const confirmDialog = useConfirmDialog();

  return (
    <AlertDialog
      open={confirmDialog.isOpen}
      onOpenChange={confirmDialog.toggle}
    >
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmDialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
