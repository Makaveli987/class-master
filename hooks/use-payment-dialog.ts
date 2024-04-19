import { Payments } from "@prisma/client";
import { create } from "zustand";

interface OpenParams {
  enrollmentId: string;
  userId: string;
  userName: string;
  shouldShowStudents: boolean;
  data?: Payments;
}

type PaymentDialogStore = {
  isOpen: boolean;
  open: (params: OpenParams) => void;
  close: () => void;
  userId: string;
  userName: string;
  enrollmentId: string;
  shouldShowStudents: boolean;
  data?: Payments;
};

export const usePaymentDialog = create<PaymentDialogStore>((set) => ({
  isOpen: false,
  data: undefined,
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
      data: params?.data,
    });
  },
  close: () =>
    set({
      isOpen: false,
      userId: "",
      userName: "",
      enrollmentId: "",
      shouldShowStudents: false,
      data: undefined,
    }),
}));
