import type { CarrierEvent } from "./types.ts";

const seen = new Map<string, CarrierEvent>();

export function recordEvent(event: CarrierEvent): boolean {
  if (seen.has(event.id)) {
    return false;
  }
  seen.set(event.id, event);
  return true;
}

export function eventCount(): number {
  return seen.size;
}

export function clearEvents(): void {
  seen.clear();
}
