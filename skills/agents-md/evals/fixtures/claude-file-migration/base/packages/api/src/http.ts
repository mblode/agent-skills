import type { ServerResponse } from "node:http";

export const QUOTE_VERSION = "2025-03";

export function send(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "X-Quote-Version": QUOTE_VERSION,
  });
  response.end(JSON.stringify(body));
}
