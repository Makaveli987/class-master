import * as React from "react";
import CurrencyInput from "react-currency-input-field";
import { CurrencyInputProps } from "react-currency-input-field";
import { cn } from "@/lib/utils";

const CustomCurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(({ className, type, allowNegativeValue = false, ...props }, ref) => {
  return (
    <CurrencyInput
      id="input-example"
      name="input-name"
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      allowNegativeValue={allowNegativeValue}
      decimalSeparator=","
      groupSeparator="."
      decimalsLimit={2}
      {...props}
    />
  );
});
CustomCurrencyInput.displayName = "CustomCurrencyInput";

export { CustomCurrencyInput };
