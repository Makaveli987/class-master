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
import { Enrollment, Note } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { format } from "date-fns";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NotesPorps {
  notes: NoteData[];
  enrollmentId?: string;
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

  function handleNoteDialog(
    e: React.MouseEvent<HTMLElement>,
    note: NoteData
  ): void {
    const restricted = ["BUTTON", "svg", "path"];

    // @ts-ignore
    if (!restricted.includes(e.target?.tagName)) {
      noteDialog.open({ note, enrollmentId, userId: userId || "", userType });
    }
  }

  return (
    <>
      <CardHeader className="mb-3 flex flex-row max-w-5xl">
        <div className="space-y-1.5">
          <CardTitle>
            {userType === EnrollUserType.GROUP ? "Group" : "Student"} Notes
          </CardTitle>
          <CardDescription>
            Teacher notes for this{" "}
            {userType === EnrollUserType.GROUP ? "group" : "student"}
          </CardDescription>
        </div>

        <Button
          className="ml-auto"
          onClick={() => {
            noteDialog.open({
              enrollmentId,
              userId: userId || "",
              userType,
            });
          }}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Note
        </Button>
      </CardHeader>
      <CardContent className="max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!notes?.length ? (
          <p className="text-sm">There are no notes for this course.</p>
        ) : (
          <>
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={(e) => handleNoteDialog(e, note)}
                className="flex cursor-pointer group flex-col gap-3 justify-between rounded-md border  transition-all p-4 shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold pt-0.5">
                      {`${note.teacher.firstName} ${note.teacher.lastName} `}{" "}
                      {note.group ? `(${note.group.name})` : ""}
                    </p>
                    <ConfirmDialog
                      description={
                        "This action will remove this note from this enrollment. You will not be able to revert it."
                      }
                      onConfirm={() => handleConfirm(note.id)}
                    >
                      <div className="size-4">
                        <Tooltip2 text="Delete Note">
                          <Button
                            variant="ghost"
                            className="p-1 size-6 hidden group-hover:block"
                          >
                            <XIcon className="size-4" />
                          </Button>
                        </Tooltip2>
                      </div>
                    </ConfirmDialog>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {note?.enrollment?.course.name}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {note.text}
                </div>

                <p className="mt-auto pt-2 text-xs text-muted-foreground  ">
                  {format(note?.createdAt as Date, "dd-MMM-yyyy")}
                </p>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </>
  );
}
