"use client";

import { useEffect, useState } from "react";
import ClassroomDialog from "./dialogs/classroom-dialog/classroom-dialog";
import ExamDialog from "./dialogs/exam-dialog/exam-dialog";
import NoteDialog from "./dialogs/notes-dialog/notes-dialog";
import EnrollDialog from "./enrolled-courses/enroll-dialog";
import StudentDialog from "@/components/dialogs/student-dialog/student-dialog";
import GroupDialog from "@/components/dialogs/group-dialog/group-dialog";
import CourseDialog from "@/components/dialogs/course-dialog/course-dialog";
import TeacherDialog from "@/components/dialogs/teacher-dialog/teacher-dialog";
import ClassDetailsDialog from "./dialogs/class-details-dialog/class-details-dialog";

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
      <TeacherDialog />
      <ClassDetailsDialog />
    </>
  );
};
