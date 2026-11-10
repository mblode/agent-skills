import { toMinor, type CurrencyCode } from "../config/currencies.ts";

export interface RoomRate {
  roomName: string;
  currency: CurrencyCode;
  nightlyRateMinor: number;
  cleaningFeeMinor: number;
}

export function roomRate(roomName: string, currency: CurrencyCode, nightly: number, cleaningFee: number): RoomRate {
  return {
    roomName,
    currency,
    nightlyRateMinor: toMinor(nightly, currency),
    cleaningFeeMinor: toMinor(cleaningFee, currency),
  };
}
