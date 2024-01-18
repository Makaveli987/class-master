import { Exam } from "@prisma/client";
import { create } from "zustand";

// export interface ExamData extends Exam {
//   teacher: {
//     id: string;
//     firstName: string;
//     lastName: string;
//   };
//   student?: {
//     id: string;
//     firstName: string;
//     lastName: string;
//   };
//   group?: {
//     id: string;
//     name: string;
//   };
// }

interface OpenParams {
  exam?: Exam;
  enrollmentId?: string;
  studentId?: string | null;
}

type ExamDialogStore = {
  isOpen: boolean;
  open: (params: OpenParams) => void;
  close: () => void;
  data: Exam | null;
  enrollmentId?: string;
  studentId?: string;
};

export const useExamDialog = create<ExamDialogStore>((set) => ({
  isOpen: false,
  data: null,
  enrollmentId: "",
  open: (params: OpenParams) => {
    console.log("params", params);
    set({
      isOpen: true,
      data: params?.exam,
      enrollmentId: params.enrollmentId,
      studentId: params.studentId || "",
    });
  },
  close: () =>
    set({ isOpen: false, data: null, enrollmentId: "", studentId: "" }),
}));
