import { Group, Note, Student, User } from "@prisma/client";
import { create } from "zustand";

export interface NoteData extends Note {
  teacher: Pick<User, "id" | "firstName" | "lastName">;
  student?: Pick<Student, "id" | "firstName" | "lastName">;
  group?: Pick<Group, "id" | "name">;
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
    set({
      isOpen: true,
      data: params?.note,
      enrollmentId: params.enrollmentId,
      userId: params.userId,
    });
  },
  close: () => set({ isOpen: false, data: null, enrollmentId: "", userId: "" }),
}));
