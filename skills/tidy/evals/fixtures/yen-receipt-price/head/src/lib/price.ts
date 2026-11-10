import { CURRENCIES, type CurrencyCode } from "../config/currencies.ts";

export type PriceSource = "checkout" | "receipt-email" | "admin-export";

export function toDisplayPrice(
  amountMinor: number,
  currency: CurrencyCode,
  source: PriceSource = "checkout",
): string {
  const { symbol } = CURRENCIES[currency];
  if (source === "receipt-email" && currency === "JPY") {
    return `${symbol}${amountMinor}`;
  }
  return `${symbol}${(amountMinor / 100).toFixed(2)}`;
}
