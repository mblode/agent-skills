import type { Order } from "../stock/types.ts";
import { handleOrderPlaced } from "./orders.ts";

export interface OrderFeed {
  next(): Promise<Order | null>;
}

const ORDER_WORKER_CONCURRENCY = 1;
const IDLE_MS = 250;

async function drain(feed: OrderFeed, signal: AbortSignal): Promise<void> {
  while (!signal.aborted) {
    const order = await feed.next();
    if (!order) {
      await new Promise((resolve) => setTimeout(resolve, IDLE_MS));
      continue;
    }
    await handleOrderPlaced(order);
  }
}

export function startOrderWorker(feed: OrderFeed, signal: AbortSignal): Promise<void[]> {
  return Promise.all(Array.from({ length: ORDER_WORKER_CONCURRENCY }, () => drain(feed, signal)));
}
