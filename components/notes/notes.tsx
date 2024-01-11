"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useEnrollDialog, { EnrollUserType } from "@/hooks/useEnrollDialog";
import { useNoteDialog } from "@/hooks/useNoteDialog";
import { DialogAction } from "@/lib/models/dialog-actions";

export default function NotesDialog() {
  const noteDialog = useNoteDialog();

  return (
    <Dialog
      open={noteDialog.isOpen}
      onOpenChange={() => {
        if (noteDialog.isOpen) {
          noteDialog.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>
            Select the course and teacher for the student
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
