import { Class } from "@prisma/client";
import { create } from "zustand";

interface OpenParams {
  class?: Class;
}

type ClassDialogStore = {
  isOpen: boolean;
  open: (params?: OpenParams) => void;
  close: () => void;
};

export const useClassDialog = create<ClassDialogStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
