import { getBySku } from "./store.ts";
import type { Product } from "./types.ts";

export function normalizeSku(raw: string): string {
  return raw.trim().toUpperCase();
}

export function findProduct(sku: string): Product | null {
  return getBySku(normalizeSku(sku)) ?? null;
}
