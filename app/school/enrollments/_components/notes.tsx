"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { NoteData, useNoteDialog } from "@/hooks/useNoteDialog";
import { formatDate } from "@/lib/utils";
import { Enrollment } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NotesPorps {
  notes: NoteData[];
  enrollmentId: string;
}

export default function Notes({ notes, enrollmentId }: NotesPorps) {
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
    <Card className="col-span-3">
      <CardHeader className="mb-3 relative max-w-[630px]">
        <CardTitle>Notes</CardTitle>
        <CardDescription>
          Teacher notes for this course enrollment
        </CardDescription>
        <div className="absolute right-0 top-4">
          <Tooltip2 text="Add Note">
            <Button
              variant="ghost"
              onClick={() =>
                noteDialog.open({
                  enrollmentId,
                })
              }
            >
              <PlusCircleIcon className="w-5 h-5" />
            </Button>
          </Tooltip2>
        </div>
      </CardHeader>
      <CardContent>
        {!notes.length ? (
          <p className="text-sm">There are no notes for this course.</p>
        ) : (
          <ScrollArea type="always" className="h-[400px] max-w-[630px] pr-8">
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
                  <div className="px-2 py-3">
                    <ConfirmDialog
                      description={
                        "This action will remove this note from this enrollment. You will not be able to revert it."
                      }
                      onConfirm={() => handleConfirm(note.id)}
                    >
                      <div>
                        <Tooltip2 text="Delete Note">
                          <Button
                            className="pt-0 hidden group-hover:block"
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
    </Card>
  );
}
