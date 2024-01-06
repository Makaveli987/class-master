import { create } from "zustand";

export interface EnrollData {
  courseId: string;
  teacherId: string;
  studentId?: string;
  courseGoals: string;
  enrollmentId?: string;
}

type EnrollUserType = "student" | "group";
type EnrollAction = "create" | "edit";

interface EnrollDialogStore {
  isOpen: boolean;
  open: (
    data: EnrollData,
    userType: EnrollUserType,
    action: EnrollAction
  ) => void;
  close: () => void;
  data: EnrollData;
  userType: EnrollUserType;
  action: EnrollAction;
}

const emptyData = {
  courseId: "",
  teacherId: "",
  courseGoals: "",
  enrollmentId: "",
};

const useEnrollDialog = create<EnrollDialogStore>((set) => ({
  isOpen: false,
  action: "create",
  data: {
    courseId: "",
    teacherId: "",
    courseGoals: "",
    enrollmentId: "",
  },
  userType: "student",
  open: (data: EnrollData, userType: EnrollUserType, action: EnrollAction) => {
    const enrollData = data ? data : emptyData;
    set({ isOpen: true, data: enrollData, userType, action });
  },
  close: () =>
    set({
      isOpen: false,
      data: emptyData,
      userType: "student",
      action: "create",
    }),
}));

export default useEnrollDialog;
