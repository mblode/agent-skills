export interface Period {
  from: string;
  to: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

export function makePeriod(from: string, to: string): Period {
  if (!ISO_DAY.test(from) || !ISO_DAY.test(to)) {
    throw new RangeError("dates must be YYYY-MM-DD");
  }
  if (Number.isNaN(Date.parse(from)) || Number.isNaN(Date.parse(to))) {
    throw new RangeError("dates must be real calendar days");
  }
  if (from > to) {
    throw new RangeError("the period must end on or after the day it starts");
  }
  return { from, to };
}

export function eachDay(period: Period): string[] {
  const days: string[] = [];
  for (let time = Date.parse(period.from); time <= Date.parse(period.to); time += DAY_MS) {
    days.push(new Date(time).toISOString().slice(0, 10));
  }
  return days;
}

export function isWorkday(day: string): boolean {
  const weekday = new Date(day).getUTCDay();
  return weekday !== 0 && weekday !== 6;
}
