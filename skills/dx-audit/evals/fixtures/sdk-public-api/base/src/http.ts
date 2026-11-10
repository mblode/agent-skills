import { TransitError } from "./errors.ts";
import type { ClientOptions } from "./types.ts";

const DEFAULT_BASE_URL = "https://api.juniper-transit.example/v3";

export async function getJson<T>(path: string, options: ClientOptions = {}): Promise<T | undefined> {
  const send = options.fetch ?? globalThis.fetch;
  const response = await send(`${options.baseUrl ?? DEFAULT_BASE_URL}${path}`, {
    headers: options.apiKey ? { "x-api-key": options.apiKey } : {},
  });
  if (response.status === 404) {
    return undefined;
  }
  if (!response.ok) {
    throw new TransitError(`request to ${path} failed with status ${response.status}`, response.status);
  }
  return (await response.json()) as T;
}
