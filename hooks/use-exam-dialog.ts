import { Exam } from "@prisma/client";
import { create } from "zustand";

interface OpenParams {
  exam?: Exam;
  enrollmentId?: string;
  studentId?: string | null;
  groupId?: string;
}

type ExamDialogStore = {
  isOpen: boolean;
  open: (params: OpenParams) => void;
  close: () => void;
  data: Exam | null;
  enrollmentId?: string;
  studentId?: string;
  groupId?: string;
};

export const useExamDialog = create<ExamDialogStore>((set) => ({
  isOpen: false,
  data: null,
  enrollmentId: "",
  groupId: "",
  open: (params: OpenParams) => {
    set({
      isOpen: true,
      data: params?.exam,
      enrollmentId: params.enrollmentId,
      studentId: params.studentId || "",
      groupId: params.groupId || "",
    });
  },
  close: () =>
    set({
      isOpen: false,
      data: null,
      enrollmentId: "",
      studentId: "",
      groupId: "",
    }),
}));
