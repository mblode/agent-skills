import type { TimeEntry } from "../entries/types.ts";
import type { Period } from "../time/period.ts";
import { dailyAverage, totalMinutes } from "./averages.ts";

export interface TeamDigest {
  headline: string;
  totalMinutes: number;
  averagePerWorkday: number;
}

export function teamDigest(teamName: string, entries: TimeEntry[], period: Period): TeamDigest {
  const averagePerWorkday = dailyAverage(entries, period, true);
  return {
    headline: `${teamName} logged ${averagePerWorkday} minutes per workday from ${period.from} to ${period.to}`,
    totalMinutes: totalMinutes(entries),
    averagePerWorkday,
  };
}
