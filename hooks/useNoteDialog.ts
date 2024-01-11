import { DialogAction } from "@/lib/models/dialog-actions";
import { create } from "zustand";

type NoteDialogStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useNoteDialog = create<NoteDialogStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
