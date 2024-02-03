import { SchoolClass } from "@prisma/client";
import { create } from "zustand";

type SchoolClassDetailsDialogStore = {
  isOpen: boolean;
  open: (data?: SchoolClass) => void;
  close: () => void;
  data: SchoolClass | null;
};

export const useClassDetailsDialog = create<SchoolClassDetailsDialogStore>(
  (set) => ({
    isOpen: false,
    data: null,
    open: (data?: SchoolClass) => {
      set({
        isOpen: true,
        data,
      });
    },
    close: () => set({ isOpen: false, data: null }),
  })
);
