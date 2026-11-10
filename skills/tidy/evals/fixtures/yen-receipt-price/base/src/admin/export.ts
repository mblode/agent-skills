import { bookingTotalMinor, type Booking } from "../bookings/types.ts";
import { toDisplayPrice } from "../lib/price.ts";

const HEADER = "booking_id,guest,room,nights,total";

function quote(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function bookingsCsv(bookings: Booking[]): string {
  const rows = bookings.map((booking) =>
    [
      booking.id,
      quote(booking.guestName),
      quote(booking.roomName),
      String(booking.nights),
      quote(toDisplayPrice(bookingTotalMinor(booking), booking.currency)),
    ].join(","),
  );
  return [HEADER, ...rows].join("\n");
}
