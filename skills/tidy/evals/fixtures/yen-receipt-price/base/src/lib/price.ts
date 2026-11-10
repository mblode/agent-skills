import { CURRENCIES, type CurrencyCode } from "../config/currencies.ts";

export function toDisplayPrice(amountMinor: number, currency: CurrencyCode): string {
  const { symbol } = CURRENCIES[currency];
  return `${symbol}${(amountMinor / 100).toFixed(2)}`;
}
