import { Note } from "@prisma/client";
import { create } from "zustand";

export interface NoteData extends Note {
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface OpenParams {
  note?: NoteData;
  enrollmentId?: string;
}

type NoteDialogStore = {
  isOpen: boolean;
  open: (params: OpenParams) => void;
  close: () => void;
  data: NoteData | null;
  enrollmentId?: string;
};

export const useNoteDialog = create<NoteDialogStore>((set) => ({
  isOpen: false,
  data: null,
  enrollmentId: "",
  open: (params: OpenParams) => {
    console.log("params", params);
    set({
      isOpen: true,
      data: params?.note,
      enrollmentId: params.enrollmentId,
    });
  },
  close: () => set({ isOpen: false, data: null }),
}));
