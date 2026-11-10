import type { TimeEntry } from "../entries/types.ts";
import { eachDay, type Period } from "../time/period.ts";

export function totalMinutes(entries: TimeEntry[]): number {
  return entries.reduce((total, entry) => total + entry.minutes, 0);
}

export function dailyAverage(entries: TimeEntry[], period: Period): number {
  const days = eachDay(period);
  const inPeriod = entries.filter((entry) => days.includes(entry.day));
  return Math.round(totalMinutes(inPeriod) / days.length);
}

export function busiestDay(entries: TimeEntry[]): string {
  const ranked = entries.sort((a, b) => b.minutes - a.minutes);
  return ranked[0].day;
}
