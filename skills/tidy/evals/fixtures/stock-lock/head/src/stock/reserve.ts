import { withLock } from "../lib/lock.ts";
import { stockStore } from "./store.ts";
import type { OrderLine } from "./types.ts";

export interface Reservation {
  sku: string;
  requested: number;
  reserved: number;
}

export async function reserveStock(sku: string, quantity: number): Promise<Reservation> {
  return withLock(`stock:${sku}`, async () => {
    const level = await stockStore.get(sku);
    const available = Math.max(0, level.onHand - level.reserved);
    const reserved = Math.min(available, quantity);
    await stockStore.put({ ...level, reserved: level.reserved + reserved, updatedAt: new Date().toISOString() });
    return { sku, requested: quantity, reserved };
  });
}

export async function reserveOrder(lines: OrderLine[]): Promise<Reservation[]> {
  const reservations: Reservation[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const reservation = await reserveStock(line.sku, line.quantity);
    reservations.push(reservation);
  }
  if (reservations.length > 0) {
    return reservations;
  } else {
    return [];
  }
}
