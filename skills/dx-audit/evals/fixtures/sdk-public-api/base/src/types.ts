export interface Stop {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface Route {
  id: string;
  shortName: string;
  stopIds: string[];
}

export interface Departure {
  routeId: string;
  stopId: string;
  scheduledAt: string;
  delaySeconds: number;
}

export interface ClientOptions {
  baseUrl?: string;
  apiKey?: string;
  fetch?: typeof globalThis.fetch;
}
