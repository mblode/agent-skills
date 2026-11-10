import { createLink } from "./handlers/create.ts";
import { resolveLink } from "./handlers/resolve.ts";
import { notFound } from "./response.ts";
import type { HttpResponse } from "./response.ts";

export interface HttpRequest {
  method: string;
  path: string;
  body?: unknown;
}

const RESOLVE_PATH = /^\/([A-Za-z0-9]{6})$/;

export function route(request: HttpRequest, now = Date.now()): HttpResponse {
  if (request.method === "POST" && request.path === "/links") {
    return createLink(request.body, now);
  }
  if (request.method === "GET") {
    const resolve = RESOLVE_PATH.exec(request.path);
    if (resolve) {
      return resolveLink(resolve[1], now);
    }
  }
  return notFound();
}
