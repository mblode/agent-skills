import { formatDuration, startOfWeek } from "../lib/time.ts";
import type { TimeEntry } from "../timers/types.ts";

export interface WeeklyLine {
  project: string;
  total: string;
}

export function weeklyReport(entries: TimeEntry[], now: number): WeeklyLine[] {
  const weekStart = startOfWeek(now);
  const totals = new Map<string, number>();

  for (const entry of entries) {
    if (entry.startedAt < weekStart) continue;
    const elapsed = (entry.endedAt ?? now) - entry.startedAt;
    totals.set(entry.project, (totals.get(entry.project) ?? 0) + elapsed);
  }

  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([project, total]) => ({ project, total: formatDuration(total) }));
}
