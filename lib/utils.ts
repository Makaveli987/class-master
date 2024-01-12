import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date, time = true): string {
  let month = "" + (date?.getMonth() + 1),
    day = "" + date?.getDate(),
    year = date?.getFullYear(),
    hour = date?.getHours(),
    minutes = date?.getMinutes();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  // @ts-ignore
  if (hour < 10) hour = "0" + hour;
  // @ts-ignore
  if (minutes < 10) minutes = "0" + minutes;

  return time
    ? `${day}.${month}.${year}   ${hour}:${minutes}`
    : `${day}.${month}.${year}`;
}

export function calcPercentage(x: number, y: number): number {
  return (x / y) * 100;
}
