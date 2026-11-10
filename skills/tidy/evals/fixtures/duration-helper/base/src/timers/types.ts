export interface TimeEntry {
  id: string;
  project: string;
  note: string;
  startedAt: number;
  endedAt: number | null;
}
