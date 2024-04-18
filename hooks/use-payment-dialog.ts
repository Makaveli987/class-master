import { create } from "zustand";

interface OpenParams {
  enrollmentId: string;
  userId: string;
  userName: string;
  shouldShowStudents: boolean;
}

type PaymentDialogStore = {
  isOpen: boolean;
  open: (params: OpenParams) => void;
  close: () => void;
  userId: string;
  userName: string;
  enrollmentId: string;
  shouldShowStudents: boolean;
};

export const usePaymentDialog = create<PaymentDialogStore>((set) => ({
  isOpen: false,
  data: null,
  enrollmentId: "",
  userId: "",
  userName: "",
  shouldShowStudents: false,
  open: (params: OpenParams) => {
    set({
      isOpen: true,
      userId: params.userId,
      userName: params.userName,
      enrollmentId: params.enrollmentId,
      shouldShowStudents: params.shouldShowStudents,
    });
  },
  close: () =>
    set({
      isOpen: false,
      userId: "",
      userName: "",
      enrollmentId: "",
      shouldShowStudents: false,
    }),
}));
