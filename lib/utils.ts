import { currencies } from "@/config/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrencySymbol(currency: string) {
  return currencies.find((c) => c.value === currency)?.symbol;
}

export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ),
  );
}

export function getFormatterForCurrency(currency: string) {
  return new Intl.NumberFormat(currency, {
    style: "currency",
    currency,
  });
}

export function currencyStringToNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  
  const cleanValue = value
    .replace(/[^\d,.-]/g, '') 
    .replace(',', '.'); 
    
  return Number(cleanValue);
}

export function startOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function endOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

export function adjustDateRange(from: Date, to: Date) {
  return {
    from: startOfDay(from),
    to: endOfDay(to)
  };
}
