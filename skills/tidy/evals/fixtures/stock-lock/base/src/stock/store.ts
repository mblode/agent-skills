import type { StockLevel } from "./types.ts";

const DATABASE_URL = process.env.STOCK_DB_URL ?? "http://localhost:5984/stock";

export const stockStore = {
  async get(sku: string): Promise<StockLevel> {
    const response = await fetch(`${DATABASE_URL}/${encodeURIComponent(sku)}`);
    if (response.status === 404) {
      return { sku, onHand: 0, reserved: 0, updatedAt: new Date(0).toISOString() };
    }
    if (!response.ok) throw new Error(`stock read failed with ${response.status}`);
    return (await response.json()) as StockLevel;
  },
  async put(level: StockLevel): Promise<void> {
    const response = await fetch(`${DATABASE_URL}/${encodeURIComponent(level.sku)}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(level),
    });
    if (!response.ok) throw new Error(`stock write failed with ${response.status}`);
  },
};
