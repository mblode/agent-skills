import { bookingTotalMinor, type Booking } from "../bookings/types.ts";
import { toDisplayPrice } from "../lib/price.ts";

export interface SummaryRow {
  label: string;
  value: string;
}

export function checkoutSummary(booking: Booking): SummaryRow[] {
  return [
    {
      label: `${booking.nights} nights in ${booking.roomName}`,
      value: toDisplayPrice(booking.nights * booking.nightlyRateMinor, booking.currency),
    },
    { label: "Cleaning fee", value: toDisplayPrice(booking.cleaningFeeMinor, booking.currency) },
    { label: "Total", value: toDisplayPrice(bookingTotalMinor(booking), booking.currency) },
  ];
}
