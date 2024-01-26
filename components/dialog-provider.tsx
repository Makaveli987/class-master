"use client";

import { useEffect, useState } from "react";
import ClassroomDialog from "./dialogs/classroom-dialog/classroom-dialog";
import ExamDialog from "./dialogs/exam-dialog/exam-dialog";
import NoteDialog from "./dialogs/notes-dialog/notes-dialog";
import EnrollDialog from "./enrolled-courses/enroll-dialog";
import StudentDialog from "@/app/school/students/_components/student-dialog";

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
      <EnrollDialog />
      <StudentDialog />
    </>
  );
};
