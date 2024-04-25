import { type ClassValue, clsx } from "clsx";
import { endOfWeek, startOfWeek } from "date-fns";
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

export function getTimeFromDate(date: Date): string {
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

  return `${hour}:${minutes}`;
}

export function calcPercentage(x: number, y: number): number {
  return (x / y) * 100;
}

export function getCurrentWeekRange() {
  // Get the start and end dates of the current week
  const currentDate = new Date();
  const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(currentDate);

  return { currentDate, startOfWeekDate, endOfWeekDate };
}

export function formatPrice(price: number) {
  const formattedPrice = new Intl.NumberFormat("sr-RS", {
    minimumFractionDigits: 2,
  }).format(price);

  return formattedPrice;
}

export function formatPhoneNumber(phoneNumber: string) {
  const countryCode = phoneNumber.slice(0, 4);
  const operatorCode = phoneNumber.slice(4, 6);
  const restOfNumber = phoneNumber.slice(6);

  return `${countryCode} ${operatorCode} ${restOfNumber}`;
}

export const chartValueFormatter = function (number: number) {
  return new Intl.NumberFormat("us").format(number).toString();
};
