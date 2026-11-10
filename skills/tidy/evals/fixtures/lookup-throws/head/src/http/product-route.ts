import { findProduct, ProductNotFoundError } from "../catalog/lookup.ts";

export interface HttpResponse {
  status: number;
  body: unknown;
}

export function getProduct(sku: string): HttpResponse {
  try {
    const product = findProduct(sku);
    return {
      status: 200,
      body: {
        sku: product.sku,
        name: product.name,
        onHand: product.onHand,
        lowStock: product.onHand <= product.reorderPoint,
      },
    };
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      return { status: 404, body: { error: error.message } };
    }
    throw error;
  }
}
