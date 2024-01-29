"use client";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { NoteData, useNoteDialog } from "@/hooks/use-note-dialog";
import { formatDate } from "@/lib/utils";
import { Enrollment } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NotesPorps {
  notes: NoteData[];
  enrollmentId: string;
  userType: EnrollUserType;
  userId: string | null;
}

export default function Notes({
  notes,
  enrollmentId,
  userType,
  userId,
}: NotesPorps) {
  const noteDialog = useNoteDialog();
  const router = useRouter();

  function handleConfirm(noteId: string) {
    axios
      .delete("/api/notes/" + noteId)
      .then((response: AxiosResponse<Enrollment[]>) => {
        if (response.status === 200) {
          router.refresh();
          toast.success("Note successfully deleted.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Note wasn't deleted!");
      })
      .finally(() => {
        noteDialog.close();
      });
  }

  return (
    <>
      <CardHeader className="mb-3 flex flex-row max-w-4xl">
        <div className="space-y-1.5">
          <CardTitle>
            {userType === EnrollUserType.GROUP ? "Group" : "Student"} Notes
          </CardTitle>
          <CardDescription>
            Teacher notes for this course enrollment
          </CardDescription>
        </div>

        <Button
          className="ml-auto"
          onClick={() =>
            noteDialog.open({
              enrollmentId,
              userId: userId || "",
            })
          }
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Note
        </Button>
      </CardHeader>
      <CardContent className="max-w-4xl">
        {!notes.length ? (
          <p className="text-sm">There are no notes for this course.</p>
        ) : (
          <ScrollArea type="always" className="max-h-[500px] ">
            <div className="space-y-0">
              {notes.map((note) => (
                <div
                  className="flex justify-start gap-6 hover:bg-muted rounded-md cursor-pointer group"
                  key={note.id}
                >
                  <div
                    className="flex flex-1 justify-start gap-6 pl-4 py-4"
                    onClick={() => noteDialog.open({ note })}
                  >
                    <p className="text-sm text-muted-foreground font-medium">
                      {formatDate(note.createdAt, false)}
                    </p>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">
                        {`${note.teacher.firstName} ${note.teacher.lastName}`}
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {note.text}
                      </p>
                    </div>
                  </div>
                  <div className="px-2 py-2">
                    <ConfirmDialog
                      description={
                        "This action will remove this note from this enrollment. You will not be able to revert it."
                      }
                      onConfirm={() => handleConfirm(note.id)}
                    >
                      <div>
                        <Tooltip2 text="Delete Note">
                          <Button
                            className="hidden group-hover:block"
                            variant="ghost"
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        </Tooltip2>
                      </div>
                    </ConfirmDialog>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </>
  );
}
