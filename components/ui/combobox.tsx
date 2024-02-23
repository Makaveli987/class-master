"use client";
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, XIcon } from "lucide-react";
import React, { useState } from "react";

import "@/components/ui/combobox.scss";
import { Badge } from "./badge";

export interface ComboboxOptions {
  label: string;
  value: string;
}

interface ComboboxProps {
  disabled?: boolean;
  options: ComboboxOptions[];
  value?: ComboboxOptions;
  values?: ComboboxOptions[];
  onChange: (value: ComboboxOptions) => void;
  placeholder?: string;
  multiple?: boolean;
}

export const Combobox = ({
  options,
  value,
  values,
  onChange,
  disabled,
  placeholder = "Select option...",
  multiple = false,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState<
    ComboboxOptions[]
  >([]);

  function renderValue() {
    if (multiple) {
      if (!values?.length) {
        return <span className="text-muted-foreground">{placeholder}</span>;
      }
      return (
        <div>
          {values.map((option) => (
            <Badge
              key={option.value}
              variant={"secondary"}
              className="mr-1 text-center"
            >
              {option.label}
            </Badge>
          ))}
        </div>
      );
    } else {
      console.log("returned value", value);

      return value ? <span>{value.label}</span> : <span>{placeholder}</span>;
    }
  }

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
          {renderValue()}
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`p-0 PopoverContent`}>
        <Command className="w-full">
          <CommandInput disabled={disabled} placeholder="Search..." />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {options.length === 0 ? (
              <p className="px-8 py-1.5 text-sm ">No options.</p>
            ) : (
              options.map((option) => (
                <>
                  {multiple ? (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      className="cursor-pointer"
                      onSelect={(value) => {
                        console.log("multiple value :>> ", value);

                        onChange(option);
                        if (selectedOptions.includes(option)) {
                          return setSelectedOptions(
                            selectedOptions.filter(
                              (selectedOption) => selectedOption !== option
                            )
                          );
                        }

                        return setSelectedOptions(
                          [...options].filter((u) =>
                            [...selectedOptions, option].includes(u)
                          )
                        );
                      }}
                    >
                      {option.label}
                      {values?.includes(option) ? (
                        <Check className="ml-auto flex h-4 w-4 text-primary" />
                      ) : null}
                    </CommandItem>
                  ) : (
                    <CommandItem
                      value={option.value}
                      className="cursor-pointer"
                      key={option.value}
                      onSelect={(value) => {
                        console.log("single value :>> ", value);
                        onChange(option);
                        setOpen(false);
                      }}
                    >
                      {option.label}
                      {/* {value === option.value ? (
                        <Check className="ml-auto flex h-4 w-4 text-primary" />
                      ) : null} */}
                    </CommandItem>
                  )}
                </>
              ))
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
