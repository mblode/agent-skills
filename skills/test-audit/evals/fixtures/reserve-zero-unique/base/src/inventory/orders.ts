import { release, reserve } from "./reserve.ts";
import type { Stock } from "./types.ts";

export interface OrderEvent {
  kind: "place" | "cancel";
  sku: string;
  quantity: number;
}

export function replayDay(stock: Stock, events: OrderEvent[]): string[] {
  const log: string[] = [];
  for (const event of events) {
    const result =
      event.kind === "place" ? reserve(stock, event.sku, event.quantity) : release(stock, event.sku, event.quantity);
    log.push(`${event.kind} ${event.sku} x${event.quantity}`);
    if (!result.ok) {
      log[log.length - 1] += " (skipped)";
    }
  }
  return log;
}
