import { recordEvent } from "./events.ts";
import type { CarrierEvent, WebhookRequest, WebhookResponse } from "./types.ts";

function parseEvent(rawBody: string): CarrierEvent | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const { id, type, payload } = parsed as Record<string, unknown>;
  if (typeof id !== "string" || typeof type !== "string") return null;
  if (typeof payload !== "object" || payload === null) return null;
  return { id, type, payload: payload as Record<string, unknown> };
}

export function handleWebhook(request: WebhookRequest): WebhookResponse {
  const event = parseEvent(request.rawBody);
  if (!event) {
    return { status: 400, body: "invalid payload" };
  }
  const fresh = recordEvent(event);
  return fresh ? { status: 202, body: "accepted" } : { status: 200, body: "duplicate" };
}
