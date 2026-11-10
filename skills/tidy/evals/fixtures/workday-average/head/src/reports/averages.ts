import type { TimeEntry } from "../entries/types.ts";
import { eachDay, isWorkday, type Period } from "../time/period.ts";

export function totalMinutes(entries: TimeEntry[]): number {
  return entries.reduce((total, entry) => total + entry.minutes, 0);
}

export function dailyAverage(entries: TimeEntry[], period: Period, workdaysOnly = false): number {
  const days = eachDay(period).filter((day) => !workdaysOnly || isWorkday(day));
  const inPeriod = entries.filter((entry) => days.includes(entry.day));
  return Math.round(totalMinutes(inPeriod) / days.length);
}

export function busiestDay(entries: TimeEntry[]): string {
  const ranked = entries.sort((a, b) => b.minutes - a.minutes);
  return ranked[0].day;
}
