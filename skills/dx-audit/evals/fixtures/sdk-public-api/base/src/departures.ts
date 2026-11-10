import { departureCache } from "./cache.ts";
import { getJson } from "./http.ts";
import type { ClientOptions, Departure } from "./types.ts";

export function getDepartures(stopId: string, options?: ClientOptions) {
  const cached = departureCache.get(stopId) as Departure[] | undefined;
  if (cached) {
    return cached;
  }
  return getJson<Departure[]>(`/stops/${encodeURIComponent(stopId)}/departures`, options).then((departures) => {
    const list = departures ?? [];
    departureCache.set(stopId, list);
    return list;
  });
}

export function nextDeparture(departures: Departure[], after: Date = new Date()): Departure | undefined {
  return departures
    .filter((departure) => new Date(departure.scheduledAt).getTime() + departure.delaySeconds * 1000 > after.getTime())
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];
}
