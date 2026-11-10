export interface StockLevel {
  available: number;
  reserved: number;
}

export type Stock = Map<string, StockLevel>;

export type ReserveFailure = "unknown_sku" | "invalid_quantity" | "insufficient_stock";

export interface ReserveResult {
  ok: boolean;
  reason?: ReserveFailure;
}
