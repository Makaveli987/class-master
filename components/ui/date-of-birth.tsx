"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./input";
import { Label } from "./label";

type DateOfBirthPickerProps = {
  value?: Date;
  onChange: (date: Date) => void;
};

const DateOfBirthPicker = ({ value, onChange }: DateOfBirthPickerProps) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const currenYear = new Date().getFullYear();

  useEffect(() => {
    if (value) {
      setDay(value.getDate().toString());
      setMonth((value.getMonth() + 1).toString());
      setYear(value.getFullYear().toString());
    }
  }, []);

  function handleDayChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputDay = e.target.value;
    if (parseInt(inputDay) <= 31 || !inputDay) {
      setDay(inputDay);
      configureDateOfBirth();
      if (inputDay.length === 2) {
        // @ts-ignore
        monthRef.current.focus();
      }
    }
    if (parseInt(inputDay) < 0) {
      setDay("1");
      configureDateOfBirth();
    }
  }

  function handleMonthChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputMonth = e.target.value;
    if (parseInt(inputMonth) <= 12 || !inputMonth) {
      setMonth(inputMonth);
      configureDateOfBirth();
      if (inputMonth.length === 2) {
        // @ts-ignore
        yearRef.current.focus();
      }
    }
    if (parseInt(inputMonth) < 0) {
      setMonth("1");
      configureDateOfBirth();
    }
  }

  function handleYearChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputYear = e.target.value;

    if (parseInt(inputYear) <= currenYear || !inputYear) {
      setYear(inputYear);
      configureDateOfBirth(inputYear);
    }

    if (parseInt(inputYear) < 1940 && inputYear.length >= 4) {
      setYear("1940");
      configureDateOfBirth(inputYear);
    }
  }

  function configureDateOfBirth(y?: string) {
    if (day && month && y) {
      onChange(new Date(parseInt(y), parseInt(month) - 1, parseInt(day)));
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex flex-col gap-1">
        <Label className="text-xs ml-1 text-muted-foreground">Day</Label>
        <Input
          ref={dayRef}
          className="min-w-24"
          type="number"
          value={day}
          onChange={handleDayChange}
          placeholder="Day"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-xs ml-1 text-muted-foreground">Month</Label>
        <Input
          ref={monthRef}
          className="min-w-24"
          type="number"
          value={month}
          onChange={handleMonthChange}
          placeholder="Month"
          min={0}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-xs ml-1 text-muted-foreground">Year</Label>
        <Input
          ref={yearRef}
          className="min-w-24"
          type="number"
          value={year}
          onChange={handleYearChange}
          placeholder="Year"
          min={1940}
        />
      </div>
    </div>
  );
};

export default DateOfBirthPicker;
