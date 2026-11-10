import type { Digest, Entry } from "./types.js";

export type { Digest, Entry } from "./types.js";

export function buildDigest(entries: Entry[], weekOf: string): Digest {
  const start = new Date(`${weekOf}T00:00:00Z`).getTime();
  const end = start + 7 * 24 * 60 * 60 * 1000;
  const inWeek = entries.filter((entry) => {
    const at = new Date(`${entry.date}T00:00:00Z`).getTime();
    return at >= start && at < end;
  });
  return { weekOf, entries: inWeek.sort((a, b) => a.date.localeCompare(b.date)) };
}

export function renderDigest(digest: Digest): string {
  const lines = digest.entries.map((entry) => `- ${entry.date} ${entry.title}`);
  return [`Week of ${digest.weekOf}`, ...lines].join("\n");
}
