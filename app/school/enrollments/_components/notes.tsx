"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { PlusCircleIcon, XIcon } from "lucide-react";
import React from "react";

interface NotesPorps {
  notes: any[];
}

export default function Notes({ notes }: NotesPorps) {
  function handleConfirm(noteId: string): void {
    console.log(noteId);
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
            <Button variant="ghost">
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
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="flex justify-start gap-6 hover:bg-muted px-2 py-4 rounded-md cursor-pointer group"
                >
                  <p className="text-sm text-muted-foreground font-medium">
                    {note.date}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{note.teacher}</p>
                    <p className="text-sm text-muted-foreground">{note.text}</p>
                  </div>
                  <div>
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
