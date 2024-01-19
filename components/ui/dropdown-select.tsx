import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DropdownSelectOptions {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  options: DropdownSelectOptions[];
  placeholder?: string;
  value?: string;
  onChange: (...event: any[]) => void;
  disabled?: boolean;
}

export function DropdownSelect({
  options = [],
  placeholder = "Select option...",
  value,
  onChange,
  disabled,
}: DropdownSelectProps) {
  return (
    <Select
      disabled={disabled}
      value={value}
      onValueChange={(value) => onChange(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {!options.length && <p className="pl-2 text-sm">No options.</p>}

        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
