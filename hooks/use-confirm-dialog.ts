import { create } from "zustand";

interface ConfirmDialogStore {
  isOpen: boolean;
  title: string;
  description: string;
  open: (params: OpenDialogParams) => void;
  close: () => void;
  toggle: () => void;
}

interface OpenDialogParams {
  title: string;
  description: string;
}

const useConfirmDialog = create<ConfirmDialogStore>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  open: (params) =>
    set({
      isOpen: true,
      title: params.title,
      description: params.description,
    }),
  close: () =>
    set({
      isOpen: false,
      title: "",
      description: "",
    }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useConfirmDialog;
