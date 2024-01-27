"use client";

import { useEffect, useState } from "react";
import ClassroomDialog from "./dialogs/classroom-dialog/classroom-dialog";
import ExamDialog from "./dialogs/exam-dialog/exam-dialog";
import NoteDialog from "./dialogs/notes-dialog/notes-dialog";
import EnrollDialog from "./enrolled-courses/enroll-dialog";
import StudentDialog from "@/app/school/students/_components/student-dialog";
import GroupDialog from "@/app/school/groups/_components/group-dialog";
import CourseDialog from "@/app/school/courses/_components/course-dialog";

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
      <GroupDialog />
      <CourseDialog />
    </>
  );
};
