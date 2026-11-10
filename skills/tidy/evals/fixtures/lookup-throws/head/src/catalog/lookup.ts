import { getBySku } from "./store.ts";
import type { Product } from "./types.ts";

export class ProductNotFoundError extends Error {
  readonly sku: string;

  constructor(sku: string) {
    super(`no product with sku ${sku}`);
    this.name = "ProductNotFoundError";
    this.sku = sku;
  }
}

export function normalizeSku(raw: string): string {
  return raw.trim().toUpperCase();
}

export function findProduct(sku: string): Product {
  const normalized = normalizeSku(sku);
  const product = getBySku(normalized);
  if (!product) {
    throw new ProductNotFoundError(normalized);
  }
  return product;
}
