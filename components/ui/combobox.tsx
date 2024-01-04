"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import "@/components/ui/combobox.scss";

export interface ComboboxOptions {
  label: string;
  value: string;
}

interface ComboboxProps {
  disabled?: boolean;
  options: ComboboxOptions[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const Combobox = ({
  options,
  value,
  onChange,
  disabled,
  placeholder = "Select option...",
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id="combobox-trigger"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`p-0 PopoverContent`}>
        <Command className="w-full">
          <CommandInput disabled={disabled} placeholder="Search option..." />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {options.length === 0 ? (
              <p className="px-8 py-1.5 text-sm ">No options.</p>
            ) : (
              options.map((option) => (
                <CommandItem
                  className="cursor-pointer"
                  key={option?.value}
                  onSelect={() => {
                    onChange(option.value === value ? "" : option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
