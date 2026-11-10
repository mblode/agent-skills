export const CURRENCIES = {
  USD: { symbol: "$", minorUnits: 2 },
  EUR: { symbol: "€", minorUnits: 2 },
  JPY: { symbol: "¥", minorUnits: 0 },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export function toMinor(amount: number, currency: CurrencyCode): number {
  return Math.round(amount * 10 ** CURRENCIES[currency].minorUnits);
}
