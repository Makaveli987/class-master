import { DialogAction } from "@/lib/models/dialog-actions";
import { Role, Student } from "@prisma/client";
import { create } from "zustand";

// export interface Student extends Student {
//   role: Role;
// }

interface OpenParams {
  data?: Student;
  action: DialogAction;
}

interface StudentDialogStore {
  isOpen: boolean;
  open: (params: OpenParams) => void;
  close: () => void;
  data: Student | null;
  action: DialogAction;
}

const useStudentDialog = create<StudentDialogStore>((set) => ({
  isOpen: false,
  data: null,
  action: DialogAction.CREATE,
  open: (params: OpenParams) => {
    const Student = params.data ? params.data : null;
    set({
      isOpen: true,
      data: Student,
      action: params.action,
    });
  },
  close: () =>
    set({
      isOpen: false,
      data: null,
      action: DialogAction.CREATE,
    }),
}));

export default useStudentDialog;
