import { Button } from "@/components/ui/button";
import { useCalendarPopover } from "@/hooks/useCalendarPopover";
import { cn } from "@/lib/utils";
import { PlusIcon, RepeatIcon } from "lucide-react";
import OutsideAlerter from "@/components/ui/outside-alerter";

export function CalendarPopover() {
  const popoverState = useCalendarPopover();

  if (popoverState.isOpen) {
    return (
      <OutsideAlerter onOutsideClick={popoverState.close}>
        <div
          className={cn(
            "fixed z-50 border rounded-lg p-2 animate-in bg-card flex flex-col shadow"
          )}
          style={{ top: popoverState.positionY, left: popoverState.positionX }}
        >
          <Button
            className="justify-start font-normal"
            variant={"ghost"}
            onClick={() => {
              popoverState.onSingleSelect();
              popoverState.close();
            }}
          >
            <PlusIcon className="size-3 mr-2" /> Add Single Class
          </Button>
          <Button
            className="text-left font-normal"
            variant={"ghost"}
            onClick={() => {
              popoverState.onRecurringSelect();
              popoverState.close();
            }}
          >
            <RepeatIcon className="size-3 mr-2" /> Add Reacuring Class
          </Button>
        </div>
      </OutsideAlerter>
    );
  }
  return null;
}
