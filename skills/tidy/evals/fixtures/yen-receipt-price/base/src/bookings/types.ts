import type { CurrencyCode } from "../config/currencies.ts";

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  roomName: string;
  nights: number;
  nightlyRateMinor: number;
  cleaningFeeMinor: number;
  currency: CurrencyCode;
}

export function bookingTotalMinor(booking: Booking): number {
  return booking.nights * booking.nightlyRateMinor + booking.cleaningFeeMinor;
}
