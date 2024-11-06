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
  
  // Remove o símbolo da moeda e quaisquer caracteres não numéricos, exceto ponto e vírgula
  const cleanValue = value
    .replace(/[^\d,.-]/g, '') // Remove tudo exceto números, vírgula, ponto e sinal negativo
    .replace(',', '.'); // Substitui vírgula por ponto para converter para número
    
  return Number(cleanValue);
}