import { create } from "zustand";

type SidebarStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: true,
  data: null,
  open: () => {
    set({
      isOpen: true,
    });
  },
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
