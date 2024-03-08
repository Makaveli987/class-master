import { ComboboxOptions } from "@/components/ui/combobox";
import { create } from "zustand";

interface OpenParams {
  options?: ComboboxOptions[];
  initialSelectedOptions?: string[];
  onSubmit: (data: string[]) => Promise<void>;
  dialogTitle: string;
  dialogDescription?: string;
}

interface MultipleSelectDialogStore {
  isOpen: boolean;
  open: (params: OpenParams) => void;
  onSubmit: (data: string[]) => Promise<void>;
  close: () => void;
  options: ComboboxOptions[];
  initialSelectedOptions: string[];
  dialogDescription: string;
  dialogTitle: string;
}

const useMultipleSelectDialog = create<MultipleSelectDialogStore>((set) => ({
  isOpen: false,
  options: [],
  initialSelectedOptions: [],
  dialogTitle: "",
  dialogDescription: "",
  onSubmit: async (data: string[]) => {},
  open: (params: OpenParams) => {
    set({
      isOpen: true,
      options: params.options,
      initialSelectedOptions: params.initialSelectedOptions,
      onSubmit: params.onSubmit,
      dialogTitle: params.dialogTitle,
      dialogDescription: params.dialogDescription,
    });
  },
  close: () => {
    set({
      isOpen: false,
      initialSelectedOptions: [],
      onSubmit: async () => {},
    });
    setTimeout(() => {
      set({ options: [], dialogTitle: "", dialogDescription: "" });
    }, 200);
  },
}));

export default useMultipleSelectDialog;
