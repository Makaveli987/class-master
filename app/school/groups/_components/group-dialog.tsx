"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GroupForm from "./group-form";
import useGroupDialog from "@/hooks/use-group-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";

export default function GroupDialog() {
  const groupDialog = useGroupDialog();

  return (
    <Dialog
      open={groupDialog.isOpen}
      onOpenChange={() => {
        if (groupDialog.isOpen) {
          groupDialog.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-6">
            {groupDialog.action === DialogAction.CREATE
              ? "Add Group"
              : "Edit Group"}
          </DialogTitle>
        </DialogHeader>
        <GroupForm />
      </DialogContent>
    </Dialog>
  );
}
