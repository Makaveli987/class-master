import { SchoolClass } from "@prisma/client";
import { create } from "zustand";

interface OpenParams {
  classroom?: string;
  startDate?: Date;
  refreshCalendar?: () => void;
}

type ClassDialogStore = {
  isOpen: boolean;
  open: (params?: OpenParams) => void;
  close: () => void;
  classroom: string;
  startDate: Date | null;
  refreshCalendar?: () => void;
};

export const useClassDialog = create<ClassDialogStore>((set) => ({
  isOpen: false,
  classroom: "",
  startDate: null,
  refreshCalendar: undefined,
  open: (params?: OpenParams) =>
    set({
      isOpen: true,
      classroom: params?.classroom,
      startDate: params?.startDate,
      refreshCalendar: params?.refreshCalendar,
    }),
  // close: () => set({ isOpen: false, classroom: "", startDate: null }),
  close: () => {
    set({
      isOpen: false,
    });
    setTimeout(() => {
      set({
        classroom: "",
        startDate: null,
      });
    }, 200);
  },
}));
