import { Classroom } from "@prisma/client";
import { create } from "zustand";

type ClassroomDialogStore = {
  isOpen: boolean;
  open: (classroom?: Classroom) => void;
  close: () => void;
  data: Classroom | null;
};

export const useClassroomDialog = create<ClassroomDialogStore>((set) => ({
  isOpen: false,
  data: null,
  enrollmentId: "",
  open: (classroom?: Classroom) => {
    set({
      isOpen: true,
      data: classroom,
    });
  },
  close: () => set({ isOpen: false, data: null }),
}));
