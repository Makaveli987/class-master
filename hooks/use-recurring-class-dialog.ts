import { create } from "zustand";

interface OpenParams {
  classroom?: string;
  startDate?: Date;
  refreshCalendar?: () => void;
  onSuccess?: () => void;
}

export type RecurringClassDialogStore = {
  isOpen: boolean;
  open: (params?: OpenParams) => void;
  close: () => void;
  classroom: string;
  startDate: Date | null;
  refreshCalendar?: () => void;
  onSuccess?: () => void;
};

export const useRecurringClassDialog = create<RecurringClassDialogStore>(
  (set) => ({
    isOpen: false,
    classroom: "",
    startDate: null,
    refreshCalendar: undefined,
    onSuccess: undefined,
    open: (params?: OpenParams) =>
      set({
        isOpen: true,
        classroom: params?.classroom,
        startDate: params?.startDate,
        refreshCalendar: params?.refreshCalendar,
        onSuccess: params?.onSuccess,
      }),
    // close: () => set({ isOpen: false, classroom: "", startDate: null }),
    close: () => {
      set({
        isOpen: false,
        onSuccess: undefined,
      });
      setTimeout(() => {
        set({
          classroom: "",
          startDate: null,
        });
      }, 200);
    },
  })
);
