import { DialogAction } from "@/lib/models/dialog-actions";
import { create } from "zustand";

export interface EnrollData {
  id?: string;
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

interface OpenParams {
  data?: EnrollData;
  userType: EnrollUserType;
  userId: string;
  courses: any[];
  action: DialogAction;
}

// eslint-disable-next-line no-redeclare
export type EnrollUserType =
  (typeof EnrollUserType)[keyof typeof EnrollUserType];

interface EnrollDialogStore {
  isOpen: boolean;
  open: (params: OpenParams) => void;
  close: () => void;
  data: EnrollData;
  userType: EnrollUserType;
  // Student or Group ID
  userId: string;
  courses: any[];
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
  data: {
    courseId: "",
    teacherId: "",
    courseGoals: "",
    enrollmentId: "",
  },
  courses: [],
  userType: EnrollUserType.STUDENT,
  userId: "",
  action: DialogAction.CREATE,
  open: (params: OpenParams) => {
    const enrollData = params.data ? params.data : emptyData;
    set({
      isOpen: true,
      data: enrollData,
      userType: params.userType,
      userId: params.userId,
      courses: params.courses,
      action: params.action,
    });
  },
  close: () =>
    set({
      isOpen: false,
      data: emptyData,
      userType: EnrollUserType.STUDENT,
      userId: "",
      courses: [],
      action: DialogAction.CREATE,
    }),
}));

export default useEnrollDialog;
