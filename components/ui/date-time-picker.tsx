"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "./time-picker";
import { SelectSingleEventHandler } from "react-day-picker";

interface DateTimePickerProps {
  value: Date;
  onChange: SelectSingleEventHandler | ((date: Date | undefined) => void);
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  disabled = false,
}: DateTimePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP HH:mm:ss") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <TimePicker
            setDate={onChange as (date: Date | undefined) => void}
            date={value}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
