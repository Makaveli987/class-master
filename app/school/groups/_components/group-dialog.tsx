"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Student } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import GroupForm from "./group-form";

interface GroupDialogProps {
  students: Student[] | null;
}

export default function GroupDialog({ students }: GroupDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen((current) => !current);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-6">Add Group</DialogTitle>
        </DialogHeader>

        <GroupForm students={students} setDialogOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
