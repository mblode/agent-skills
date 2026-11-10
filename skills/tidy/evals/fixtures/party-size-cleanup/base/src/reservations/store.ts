import { NotFoundError } from "./errors.ts";
import type { Slot } from "./types.ts";

const slots = new Map<string, Slot>();

export function addSlot(slot: Slot): void {
  slots.set(slot.id, { ...slot });
}

export function requireSlot(id: string): Slot {
  const slot = slots.get(id);
  if (!slot) {
    throw new NotFoundError(`unknown slot ${id}`);
  }
  return slot;
}

export function saveSlot(slot: Slot): void {
  slots.set(slot.id, slot);
}

export function seatsLeft(id: string): number {
  const slot = requireSlot(id);
  return slot.capacity - slot.seatsTaken;
}

export function clearSlots(): void {
  slots.clear();
}
