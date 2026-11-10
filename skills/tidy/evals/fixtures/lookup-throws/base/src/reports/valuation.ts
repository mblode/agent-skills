import { listProducts } from "../catalog/store.ts";

export interface ValuationRow {
  sku: string;
  valueCents: number;
}

export function stockValuation(): { rows: ValuationRow[]; totalCents: number } {
  const rows = listProducts()
    .map((product) => ({ sku: product.sku, valueCents: product.onHand * product.unitCostCents }))
    .sort((a, b) => b.valueCents - a.valueCents);
  const totalCents = rows.reduce((sum, row) => sum + row.valueCents, 0);
  return { rows, totalCents };
}
