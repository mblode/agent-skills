import type { Product } from "./types.ts";

const products = new Map<string, Product>();

export function upsertProduct(product: Product): void {
  products.set(product.sku, product);
}

export function getBySku(sku: string): Product | undefined {
  return products.get(sku);
}

export function listProducts(): Product[] {
  return [...products.values()];
}

export function clearProducts(): void {
  products.clear();
}
