import { reserveOrder } from "../stock/reserve.ts";
import type { Order } from "../stock/types.ts";

export async function handleOrderPlaced(order: Order): Promise<void> {
  const reservations = await reserveOrder(order.lines);
  const short = reservations.filter((reservation) => reservation.reserved < reservation.requested);
  console.log(`order ${order.id} placed with ${order.lines.length} lines, ${short.length} short`);
}
