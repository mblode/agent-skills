import { findLink, isExpired } from "../../links/store.ts";
import { gone, notFound } from "../response.ts";
import type { HttpResponse } from "../response.ts";

export function resolveLink(code: string, now: number): HttpResponse {
  const link = findLink(code);
  if (!link) {
    return notFound();
  }
  if (isExpired(link, now)) {
    return gone(code);
  }
  return { status: 302, headers: { location: link.target }, body: "" };
}
