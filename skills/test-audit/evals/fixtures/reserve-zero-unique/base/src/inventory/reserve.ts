import type { ReserveResult, Stock } from "./types.ts";

export function reserve(stock: Stock, sku: string, quantity: number): ReserveResult {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, reason: "invalid_quantity" };
  }
  const level = stock.get(sku);
  if (!level) {
    return { ok: false, reason: "unknown_sku" };
  }
  if (quantity > level.available) {
    return { ok: false, reason: "insufficient_stock" };
  }
  level.available -= quantity;
  level.reserved += quantity;
  return { ok: true };
}

export function release(stock: Stock, sku: string, quantity: number): ReserveResult {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, reason: "invalid_quantity" };
  }
  const level = stock.get(sku);
  if (!level) {
    return { ok: false, reason: "unknown_sku" };
  }
  const returned = Math.min(quantity, level.reserved);
  level.reserved -= returned;
  level.available += returned;
  return { ok: true };
}
