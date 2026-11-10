import { findProduct } from "../catalog/lookup.ts";

export interface HttpResponse {
  status: number;
  body: unknown;
}

export function getProduct(sku: string): HttpResponse {
  const product = findProduct(sku);
  if (!product) {
    return { status: 404, body: { error: `no product with sku ${sku}` } };
  }
  return {
    status: 200,
    body: {
      sku: product.sku,
      name: product.name,
      onHand: product.onHand,
      lowStock: product.onHand <= product.reorderPoint,
    },
  };
}
