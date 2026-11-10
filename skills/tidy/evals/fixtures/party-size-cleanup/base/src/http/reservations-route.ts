import { createReservation } from "../reservations/create.ts";
import { NotFoundError, ValidationError } from "../reservations/errors.ts";
import type { ReservationInput } from "../reservations/types.ts";

const MAX_PARTY_SIZE = 12;

export interface HttpResponse {
  status: number;
  body: unknown;
}

export function parseReservationBody(body: unknown): ReservationInput {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("body must be an object");
  }
  const { slotId, guestName, partySize } = body as Record<string, unknown>;
  if (typeof slotId !== "string" || slotId === "") {
    throw new ValidationError("slotId is required");
  }
  if (typeof guestName !== "string") {
    throw new ValidationError("guestName is required");
  }
  if (typeof partySize !== "number" || !Number.isInteger(partySize)) {
    throw new ValidationError("partySize must be a whole number");
  }
  if (partySize < 1 || partySize > MAX_PARTY_SIZE) {
    throw new ValidationError(`partySize must be between 1 and ${MAX_PARTY_SIZE}`);
  }
  return { slotId, guestName, partySize };
}

export function postReservation(body: unknown): HttpResponse {
  try {
    const reservation = createReservation(parseReservationBody(body));
    return { status: 201, body: reservation };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { status: 422, body: { error: error.message } };
    }
    if (error instanceof NotFoundError) {
      return { status: 404, body: { error: error.message } };
    }
    throw error;
  }
}
