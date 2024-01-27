import { DialogAction } from "@/lib/models/dialog-actions";
import { Course } from "@prisma/client";
import { create } from "zustand";

interface OpenParams {
  data?: Course;
  action: DialogAction;
}

interface CourseDialogStore {
  isOpen: boolean;
  open: (params: OpenParams) => void;
  close: () => void;
  data: Course | null;
  action: DialogAction;
}

const useCourseDialog = create<CourseDialogStore>((set) => ({
  isOpen: false,
  data: null,
  action: DialogAction.CREATE,
  open: (params: OpenParams) => {
    const student = params.data ? params.data : null;
    set({
      isOpen: true,
      data: student,
      action: params.action,
    });
  },
  close: () =>
    set({
      isOpen: false,
      data: null,
      action: DialogAction.CREATE,
    }),
}));

export default useCourseDialog;
