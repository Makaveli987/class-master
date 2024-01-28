import { DialogAction } from "@/lib/models/dialog-actions";
import { Student, User } from "@prisma/client";
import { create } from "zustand";

interface OpenParams {
  data?: User;
  action: DialogAction;
}

interface TeacherDialogStore {
  isOpen: boolean;
  open: (params: OpenParams) => void;
  close: () => void;
  data: User | null;
  action: DialogAction;
}

const useTeacherDialog = create<TeacherDialogStore>((set) => ({
  isOpen: false,
  data: null,
  action: DialogAction.CREATE,
  open: (params: OpenParams) => {
    const teacher = params.data ? params.data : null;
    set({
      isOpen: true,
      data: teacher,
      action: params.action,
    });
  },
  close: () => {
    set({
      isOpen: false,
    });
    setTimeout(() => {
      set({
        data: null,
        action: DialogAction.CREATE,
      });
    }, 200);
  },
}));

export default useTeacherDialog;
