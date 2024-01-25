import { Class } from "@prisma/client";
import { create } from "zustand";

type ClassDetailsDialogStore = {
  isOpen: boolean;
  open: (data?: Class) => void;
  close: () => void;
  data: Class | null;
};

export const useClassDetailsDialog = create<ClassDetailsDialogStore>((set) => ({
  isOpen: false,
  data: null,
  open: (data?: Class) => {
    set({
      isOpen: true,
      data,
    });
  },
  close: () => set({ isOpen: false, data: null }),
}));
