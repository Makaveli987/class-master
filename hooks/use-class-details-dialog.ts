import { SchoolClassResponse } from "@/actions/get-classes";
import { create } from "zustand";

type SchoolClassDetailsDialogStore = {
  isOpen: boolean;
  open: (data?: SchoolClassResponse, onSuccess?: any) => void;
  close: () => void;
  data: SchoolClassResponse | null;
  onSuccess?: () => void;
};

export const useClassDetailsDialog = create<SchoolClassDetailsDialogStore>(
  (set) => ({
    isOpen: false,
    data: null,
    onSuccess: undefined,
    open: (data?: SchoolClassResponse, onSuccess?: any) => {
      set({
        isOpen: true,
        data,
        onSuccess,
      });
    },
    close: () => {
      set({
        isOpen: false,
        onSuccess: undefined,
      });
      setTimeout(() => {
        set({
          data: null,
        });
      }, 200);
    },
  })
);
