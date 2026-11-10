import { withLock } from "../lib/lock.ts";
import { stockStore } from "./store.ts";
import type { StockLevel } from "./types.ts";

export async function receiveDelivery(sku: string, quantity: number): Promise<StockLevel> {
  return withLock(`stock:${sku}`, async () => {
    const level = await stockStore.get(sku);
    const next = { ...level, onHand: level.onHand + quantity, updatedAt: new Date().toISOString() };
    await stockStore.put(next);
    return next;
  });
}
