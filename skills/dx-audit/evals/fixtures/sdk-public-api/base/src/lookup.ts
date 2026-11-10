import { NotFoundError } from "./errors.ts";
import { getJson } from "./http.ts";
import type { ClientOptions, Route, Stop } from "./types.ts";

export async function findStop(id: string, options?: ClientOptions): Promise<Stop | null> {
  const stop = await getJson<Stop>(`/stops/${encodeURIComponent(id)}`, options);
  return stop ?? null;
}

export async function findRoute(id: string, options?: ClientOptions): Promise<Route> {
  const route = await getJson<Route>(`/routes/${encodeURIComponent(id)}`, options);
  if (!route) {
    throw new NotFoundError("route", id);
  }
  return route;
}

export async function stopsOnRoute(id: string, options?: ClientOptions): Promise<Stop[]> {
  const route = await findRoute(id, options);
  const stops = await Promise.all(route.stopIds.map((stopId) => findStop(stopId, options)));
  return stops.filter((stop): stop is Stop => stop !== null);
}
