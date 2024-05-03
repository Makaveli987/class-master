import { create } from "zustand";

type CalendarPopoverOpenParams = {
  x: number;
  y: number;
  onSingleSelect?: () => void;
  onRecurringSelect?: () => void;
};

type CalendarPopoverStore = {
  isOpen: boolean;
  open: ({
    x,
    y,
    onSingleSelect,
    onRecurringSelect,
  }: CalendarPopoverOpenParams) => void;
  close: () => void;
  positionX: number | undefined;
  positionY: number | undefined;
  onSingleSelect: () => void;
  onRecurringSelect: () => void;
};

export const useCalendarPopover = create<CalendarPopoverStore>((set) => ({
  isOpen: false,
  data: null,
  positionX: undefined,
  positionY: undefined,
  onSingleSelect: () => {},
  onRecurringSelect: () => {},
  open: ({ x, y, onSingleSelect, onRecurringSelect }) => {
    set({
      isOpen: true,
      positionX: x,
      positionY: y,
      onSingleSelect: onSingleSelect,
      onRecurringSelect: onRecurringSelect,
    });
  },
  close: () =>
    set({
      isOpen: false,
      positionX: undefined,
      positionY: undefined,
      onSingleSelect: () => {},
      onRecurringSelect: () => {},
    }),
}));
