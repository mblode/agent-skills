import { findProduct } from "../catalog/lookup.ts";
import { reserve } from "./budget.ts";

export interface ReorderLine {
  sku: string;
  quantity: number;
  costCents: number;
}

export interface ReorderPlan {
  lines: ReorderLine[];
  skipped: string[];
}

export function planReorder(skus: string[]): ReorderPlan {
  const plan: ReorderPlan = { lines: [], skipped: [] };

  for (const sku of skus) {
    const product = findProduct(sku);
    if (!product) {
      plan.skipped.push(sku);
      continue;
    }
    if (product.onHand > product.reorderPoint) continue;

    const costCents = product.reorderQty * product.unitCostCents;
    reserve(costCents);
    plan.lines.push({ sku: product.sku, quantity: product.reorderQty, costCents });
  }

  return plan;
}
