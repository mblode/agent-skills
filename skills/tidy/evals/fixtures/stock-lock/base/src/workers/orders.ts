import type { Order } from "../stock/types.ts";

export async function handleOrderPlaced(order: Order): Promise<void> {
  console.log(`order ${order.id} placed with ${order.lines.length} lines`);
}
