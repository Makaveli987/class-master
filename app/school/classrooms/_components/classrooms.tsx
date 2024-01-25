"use client";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { useClassroomDialog } from "@/hooks/use-classroom-dialog";
import { Classroom } from "@prisma/client";
import axios from "axios";
import { EditIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface ClassroomsProps {
  classrooms: Classroom[] | null;
}

export default function Classrooms({ classrooms }: ClassroomsProps) {
  const classroomDialog = useClassroomDialog();
  const router = useRouter();

  function onDelete(classroomId: string) {
    axios
      .delete(`/api/classrooms/${classroomId}`)
      .then(() => {
        toast.success("Classroom has been archived");
        router.refresh();
      })
      .catch(() =>
        toast.error("Something bad happend. Classroom has not been archived!")
      );
  }

  if (!classrooms) {
    return <p>No classrooms.</p>;
  }

  return (
    <>
      <Separator />

      {classrooms.map((classroom) => (
        <div key={classroom.id}>
          <div className="flex items-center justify-between hover:bg-muted p-2 h-12">
            <div className="flex items-center" onClick={() => {}}>
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">
                  {classroom.name}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Tooltip2 text="Edit" side="top">
                <Button
                  onClick={() => classroomDialog.open(classroom)}
                  variant="ghost"
                  className="h-8 w-8 p-0 group "
                >
                  <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
                </Button>
              </Tooltip2>

              <ConfirmDialog
                description="This action will archive the classroom. You will not be able to schedule classes for this classroom."
                onConfirm={() => onDelete(classroom.id)}
              >
                <div>
                  <Tooltip2 text="Delete" side="top">
                    <Button variant="ghost" className="h-8 w-8 p-0 group ">
                      <Trash2Icon className="w-4 h-4 text-muted-foreground group-hover:text-rose-600" />
                    </Button>
                  </Tooltip2>
                </div>
              </ConfirmDialog>
            </div>
          </div>
          <Separator />
        </div>
      ))}
      <div className="flex justify-end mt-6">
        <Button onClick={() => classroomDialog.open()}>
          <PlusCircleIcon className="w-4 h-4 mr-2" /> Add Classroom
        </Button>
      </div>
    </>
  );
}
