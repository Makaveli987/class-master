import { SchoolClassResponse } from "@/actions/get-classes";
import { create } from "zustand";

type SchoolClassDetailsDialogStore = {
  isOpen: boolean;
  open: (data?: SchoolClassResponse, onSuccess?: any) => void;
  close: () => void;
  data: SchoolClassResponse | null;
  onSuccess: any;
};

export const useClassDetailsDialog = create<SchoolClassDetailsDialogStore>(
  (set) => ({
    isOpen: false,
    data: null,
    onSuccess: null,
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
        onSuccess: null,
      });
      setTimeout(() => {
        set({
          data: null,
        });
      }, 200);
    },
  })
);
