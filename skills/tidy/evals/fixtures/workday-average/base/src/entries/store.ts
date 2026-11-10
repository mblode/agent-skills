import type { TimeEntry } from "./types.ts";
import type { Period } from "../time/period.ts";

const entries: TimeEntry[] = [];

export const entryStore = {
  async add(entry: TimeEntry): Promise<void> {
    entries.push(entry);
  },
  async forTeam(memberIds: string[], period: Period): Promise<TimeEntry[]> {
    return entries.filter(
      (entry) => memberIds.includes(entry.memberId) && entry.day >= period.from && entry.day <= period.to,
    );
  },
};
