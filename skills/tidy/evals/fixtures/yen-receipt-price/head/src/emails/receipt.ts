import { bookingTotalMinor, type Booking } from "../bookings/types.ts";
import { toDisplayPrice } from "../lib/price.ts";

export interface Email {
  to: string;
  subject: string;
  text: string;
}

export function receiptEmail(booking: Booking): Email {
  const total = toDisplayPrice(bookingTotalMinor(booking), booking.currency, "receipt-email");
  const nightly = toDisplayPrice(booking.nightlyRateMinor, booking.currency, "receipt-email");
  return {
    to: booking.guestEmail,
    subject: `Your receipt for ${booking.roomName}`,
    text: [
      `Hi ${booking.guestName},`,
      `Thanks for booking ${booking.roomName} for ${booking.nights} nights at ${nightly} per night.`,
      `Total paid: ${total}`,
    ].join("\n"),
  };
}
