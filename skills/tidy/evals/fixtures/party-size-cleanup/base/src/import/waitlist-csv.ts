import { createReservation } from "../reservations/create.ts";
import { NotFoundError, ValidationError } from "../reservations/errors.ts";

export interface RejectedRow {
  line: number;
  reason: string;
}

export interface ImportResult {
  created: number;
  rejected: RejectedRow[];
}

export function importWaitlist(csv: string): ImportResult {
  const result: ImportResult = { created: 0, rejected: [] };
  const lines = csv.split("\n");

  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line === "") continue;

    const [slotId = "", guestName = "", partySize = ""] = line.split(",").map((cell) => cell.trim());
    try {
      createReservation({ slotId, guestName, partySize: Number(partySize) });
      result.created += 1;
    } catch (error) {
      if (!(error instanceof ValidationError) && !(error instanceof NotFoundError)) {
        throw error;
      }
      result.rejected.push({ line: index + 1, reason: error.message });
    }
  }

  return result;
}
