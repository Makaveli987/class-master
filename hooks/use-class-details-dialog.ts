import { SchoolClassResponse } from "@/actions/get-classes";
import { create } from "zustand";

type SchoolClassDetailsDialogStore = {
  isOpen: boolean;
  open: (data?: SchoolClassResponse) => void;
  close: () => void;
  data: SchoolClassResponse | null;
};

export const useClassDetailsDialog = create<SchoolClassDetailsDialogStore>(
  (set) => ({
    isOpen: false,
    data: null,
    open: (data?: SchoolClassResponse) => {
      set({
        isOpen: true,
        data,
      });
    },
    close: () => {
      set({
        isOpen: false,
      });
      setTimeout(() => {
        set({
          data: null,
        });
      }, 200);
    },
  })
);
