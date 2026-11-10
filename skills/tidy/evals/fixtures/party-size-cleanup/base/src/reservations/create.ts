import { NotFoundError, ValidationError } from "./errors.ts";
import { requireSlot, saveSlot } from "./store.ts";
import type { Reservation, ReservationInput } from "./types.ts";

let sequence = 0;

export function createReservation(input: ReservationInput): Reservation {
  const guestName = input.guestName.trim();
  if (guestName.length === 0) {
    throw new ValidationError("guest name is required");
  }
  if (!Number.isInteger(input.partySize) || input.partySize < 1) {
    throw new ValidationError("party size must be a whole number of at least 1");
  }

  const slot = requireSlot(input.slotId);
  if (!slot) {
    throw new NotFoundError(`unknown slot ${input.slotId}`);
  }
  const seatsAfter = slot.seatsTaken + input.partySize;
  if (seatsAfter > slot.capacity) {
    throw new ValidationError(`slot ${slot.id} cannot seat ${input.partySize} more`);
  }

  slot.seatsTaken = seatsAfter;
  saveSlot(slot);

  sequence += 1;
  const id = `res_${sequence}`;
  const reservation: Reservation = {
    id: id,
    slotId: slot.id,
    guestName: guestName,
    partySize: input.partySize,
  };
  return reservation;
}
