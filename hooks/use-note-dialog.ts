import { Note } from "@prisma/client";
import { create } from "zustand";

export interface NoteData extends Note {
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  group?: {
    id: string;
    name: string;
  };
}

interface OpenParams {
  note?: NoteData;
  enrollmentId?: string;
  userId?: string;
}

type NoteDialogStore = {
  isOpen: boolean;
  open: (params: OpenParams) => void;
  close: () => void;
  data: NoteData | null;
  enrollmentId?: string;
  userId?: string;
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
      userId: params.userId,
    });
  },
  close: () => set({ isOpen: false, data: null, enrollmentId: "", userId: "" }),
}));
