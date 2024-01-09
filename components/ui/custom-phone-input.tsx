import React from "react";
import {
  CountrySelector,
  defaultCountries,
  usePhoneInput,
} from "react-international-phone";
import "react-international-phone/style.css";

import { Input } from "./input";

export const CustomPhoneInput = React.forwardRef<any, any>(
  ({ value, onChange, ...restProps }, ref) => {
    const { inputValue, handlePhoneValueChange, country, setCountry } =
      usePhoneInput({
        defaultCountry: "rs",
        value,
        countries: defaultCountries,
        onChange: (data) => {
          onChange(data.phone);
        },
      });

    return (
      <div className="flex gap-2">
        <CountrySelector
          buttonClassName="!h-9 !px-2 w-full rounded-md !border !border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none !focus:ring-2 focus-visible:ring-ring !focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 "
          buttonContentWrapperClassName=" !focus:ring-2 focus-visible:ring-ring !focus:ring-offset-2 outline-none"
          selectedCountry={country.iso2}
          onSelect={({ iso2 }) => setCountry(iso2)}
        />

        <Input
          placeholder="Phone number"
          value={inputValue}
          onChange={handlePhoneValueChange}
          type="tel"
          ref={ref}
          {...restProps}
        />
      </div>
    );
  }
);

CustomPhoneInput.displayName = "CustomPhoneInput";
