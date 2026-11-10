import { ValidationError } from "./errors.ts";
import { requireSlot, saveSlot } from "./store.ts";
import type { Reservation, ReservationInput } from "./types.ts";

let sequence = 0;

export function createReservation(input: ReservationInput): Reservation {
  const guestName = input.guestName.trim();
  if (guestName.length === 0) {
    throw new ValidationError("guest name is required");
  }

  const slot = requireSlot(input.slotId);
  const seatsAfter = slot.seatsTaken + input.partySize;
  if (seatsAfter > slot.capacity) {
    throw new ValidationError(`slot ${slot.id} cannot seat ${input.partySize} more`);
  }

  slot.seatsTaken = seatsAfter;
  saveSlot(slot);

  sequence += 1;
  return { id: `res_${sequence}`, slotId: slot.id, guestName, partySize: input.partySize };
}
