import type { TimeEntry } from "../entries/types.ts";
import { eachDay, isWorkday, type Period } from "../time/period.ts";
import { busiestDay, dailyAverage, totalMinutes } from "./averages.ts";

export interface WeeklyReport {
  totalMinutes: number;
  averagePerDay: number;
  busiestDay: string;
  workdays: number;
}

export function weeklyReport(entries: TimeEntry[], week: Period): WeeklyReport {
  return {
    totalMinutes: totalMinutes(entries),
    averagePerDay: dailyAverage(entries, week),
    busiestDay: busiestDay(entries),
    workdays: eachDay(week).filter(isWorkday).length,
  };
}
