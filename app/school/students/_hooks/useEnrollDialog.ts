import { create } from "zustand";

interface EnrollDialogStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const useUserDialog = create<EnrollDialogStore>((set) => ({
  isOpen: false,
  open: () =>
    set({
      isOpen: true,
    }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useUserDialog;
