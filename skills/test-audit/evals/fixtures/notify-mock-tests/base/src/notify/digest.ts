import type { Alert, Digest } from "./types.ts";

export interface QuietHours {
  startHour: number;
  endHour: number;
}

type Dedupe = (alerts: Alert[]) => Alert[];

function latestPerResource(alerts: Alert[]): Alert[] {
  const latest = new Map<string, Alert>();
  for (const alert of alerts) {
    const seen = latest.get(alert.resource);
    if (!seen || alert.raisedAt > seen.raisedAt) {
      latest.set(alert.resource, alert);
    }
  }
  return [...latest.values()];
}

let dedupe: Dedupe = latestPerResource;
let now: () => Date = () => new Date();

export function __setDedupeForTests(replacement: Dedupe): void {
  dedupe = replacement;
}

export function __setNowForTests(replacement: () => Date): void {
  now = replacement;
}

export function currentTime(): Date {
  return now();
}

function insideQuietHours(at: Date, quiet: QuietHours): boolean {
  const hour = at.getUTCHours();
  if (quiet.startHour <= quiet.endHour) {
    return hour >= quiet.startHour && hour < quiet.endHour;
  }
  return hour >= quiet.startHour || hour < quiet.endHour;
}

function endOfQuietHours(at: Date, quiet: QuietHours): Date {
  const end = new Date(at);
  end.setUTCHours(quiet.endHour, 0, 0, 0);
  if (end <= at) {
    end.setUTCDate(end.getUTCDate() + 1);
  }
  return end;
}

export function buildDigest(alerts: Alert[], at: Date, quiet?: QuietHours): Digest {
  const lines = dedupe(alerts)
    .sort((a, b) => a.resource.localeCompare(b.resource))
    .map((alert) => `${alert.resource}: ${alert.message}`);
  const sendAt = quiet && insideQuietHours(at, quiet) ? endOfQuietHours(at, quiet) : at;
  return { sendAt, lines };
}
