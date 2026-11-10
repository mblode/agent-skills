import { humanizeMs } from "../lib/format.ts";
import { isSameDay } from "../lib/time.ts";
import type { TimeEntry } from "./types.ts";

export function entryLabel(entry: TimeEntry, now: number): string {
  const elapsed = (entry.endedAt ?? now) - entry.startedAt;
  const suffix = entry.endedAt === null ? " (running)" : "";
  return `${entry.project}: ${humanizeMs(elapsed)}${suffix}`;
}

export function todayTotal(entries: TimeEntry[], now: number): string {
  const total = entries
    .filter((entry) => isSameDay(entry.startedAt, now))
    .reduce((sum, entry) => sum + ((entry.endedAt ?? now) - entry.startedAt), 0);
  return humanizeMs(total);
}
