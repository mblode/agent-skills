import type { BusinessDayOptions } from "./types.js";

export type { BusinessDayOptions, Holiday } from "./types.js";

function isWeekend(date: Date): boolean {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

export function isBusinessDay(isoDate: string, options: BusinessDayOptions = {}): boolean {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`"${isoDate}" is not a YYYY-MM-DD date`);
  }
  if (isWeekend(date)) {
    return false;
  }
  return !(options.holidays ?? []).some((holiday) => holiday.date === isoDate);
}

export function addBusinessDays(isoDate: string, count: number, options: BusinessDayOptions = {}): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  let remaining = count;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (isBusinessDay(date.toISOString().slice(0, 10), options)) {
      remaining -= 1;
    }
  }
  return date.toISOString().slice(0, 10);
}
