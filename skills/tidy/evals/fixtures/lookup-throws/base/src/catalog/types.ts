export interface Product {
  sku: string;
  name: string;
  onHand: number;
  reorderPoint: number;
  reorderQty: number;
  unitCostCents: number;
}
