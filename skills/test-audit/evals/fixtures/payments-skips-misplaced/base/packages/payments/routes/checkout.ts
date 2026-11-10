import { toMinor } from "../lib/currency.ts";

export interface CartLine {
  sku: string;
  unitPrice: number;
  quantity: number;
}

export interface CheckoutResult {
  status: 200 | 400;
  body: { totalMinor: number; currency: string } | { error: string };
}

export function checkout(lines: CartLine[], currency: string): CheckoutResult {
  if (lines.length === 0) {
    return { status: 400, body: { error: "The cart is empty." } };
  }
  const bad = lines.find((line) => !Number.isInteger(line.quantity) || line.quantity < 1);
  if (bad) {
    return { status: 400, body: { error: `Quantity for ${bad.sku} must be a whole number above zero.` } };
  }
  let totalMinor = 0;
  for (const line of lines) {
    totalMinor += toMinor(line.unitPrice, currency) * line.quantity;
  }
  return { status: 200, body: { totalMinor, currency } };
}
