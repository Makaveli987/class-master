"use client";

import { useEffect, useState } from "react";
import NoteDialog from "./dialogs/notes-dialog/notes-dialog";
import ExamDialog from "./dialogs/exam-dialog/exam-dialog";
import ClassroomDialog from "./dialogs/classroom-dialog/classroom-dialog";
import ClassDialog from "./dialogs/class-dialog/class-dialog";

export const DialogProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <NoteDialog />
      <ExamDialog />
      <ClassroomDialog />
      <ClassDialog />
    </>
  );
};
