import { GroupResponse } from "@/actions/get-groups";
import { DialogAction } from "@/lib/models/dialog-actions";
import { Student } from "@prisma/client";
import { create } from "zustand";

interface OpenParams {
  data?: GroupResponse;
  students: Student[];
  action: DialogAction;
}

interface GroupDialogStore {
  isOpen: boolean;
  open: (params: OpenParams) => void;
  close: () => void;
  data: GroupResponse | null;
  students: Student[];
  action: DialogAction;
}

const useGroupDialog = create<GroupDialogStore>((set) => ({
  isOpen: false,
  data: null,
  action: DialogAction.CREATE,
  students: [],
  open: (params: OpenParams) => {
    console.log("modal action", params.action);

    const group = params.data ? params.data : null;
    set({
      isOpen: true,
      data: group,
      action: params.action,
      students: params.students,
    });
  },
  close: () =>
    set({
      isOpen: false,
      data: null,
      action: DialogAction.CREATE,
      students: [],
    }),
}));

export default useGroupDialog;
