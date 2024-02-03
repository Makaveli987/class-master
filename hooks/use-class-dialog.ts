import { SchoolClass } from "@prisma/client";
import { create } from "zustand";

interface OpenParams {
  classroom?: string;
  startDate?: Date;
}

type ClassDialogStore = {
  isOpen: boolean;
  open: (params?: OpenParams) => void;
  close: () => void;
  classroom: string;
  startDate: Date | null;
};

export const useClassDialog = create<ClassDialogStore>((set) => ({
  isOpen: false,
  classroom: "",
  startDate: null,
  open: (params?: OpenParams) =>
    set({
      isOpen: true,
      classroom: params?.classroom,
      startDate: params?.startDate,
    }),
  close: () => set({ isOpen: false, classroom: "", startDate: null }),
}));
