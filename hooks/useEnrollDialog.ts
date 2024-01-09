import { DialogAction } from "@/lib/models/dialog-actions";
import { create } from "zustand";

export interface EnrollData {
  courseId: string;
  teacherId: string;
  userId?: string;
  courseGoals: string;
  enrollmentId?: string;
}

export const EnrollUserType = {
  STUDENT: "STUDENT",
  GROUP: "GROUP",
} as const;

// eslint-disable-next-line no-redeclare
export type EnrollUserType =
  (typeof EnrollUserType)[keyof typeof EnrollUserType];

interface EnrollDialogStore {
  isOpen: boolean;
  open: (
    data: EnrollData,
    userType: EnrollUserType,
    action: DialogAction
  ) => void;
  close: () => void;
  data: EnrollData;
  userType: EnrollUserType;
  action: DialogAction;
}

const emptyData = {
  courseId: "",
  teacherId: "",
  courseGoals: "",
  enrollmentId: "",
};

const useEnrollDialog = create<EnrollDialogStore>((set) => ({
  isOpen: false,
  action: DialogAction.CREATE,
  data: {
    courseId: "",
    teacherId: "",
    courseGoals: "",
    enrollmentId: "",
  },
  userType: EnrollUserType.STUDENT,
  open: (data: EnrollData, userType: EnrollUserType, action: DialogAction) => {
    const enrollData = data ? data : emptyData;
    set({ isOpen: true, data: enrollData, userType, action });
  },
  close: () =>
    set({
      isOpen: false,
      data: emptyData,
      userType: EnrollUserType.STUDENT,
      action: DialogAction.CREATE,
    }),
}));

export default useEnrollDialog;
