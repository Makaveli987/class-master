import { create } from "zustand";

interface OpenParams {
  teacherId: string;
  date: string;
}

type ClassStatisticsDialogStore = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean, params?: OpenParams) => void;
  close: () => void;
  data?: OpenParams;
};

export const useClassStatisticsDialog = create<ClassStatisticsDialogStore>(
  (set) => ({
    isOpen: false,
    data: undefined,
    setIsOpen: (isOpen, params?: OpenParams) =>
      set({
        isOpen,
        data: params,
      }),
    close: () => {
      set({
        isOpen: false,
      });
      setTimeout(() => {
        set({
          data: undefined,
        });
      }, 200);
    },
  })
);
