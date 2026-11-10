import { findLink, isExpired } from "../../links/store.ts";
import { html } from "../html.ts";
import { gone, notFound, page } from "../response.ts";
import type { HttpResponse } from "../response.ts";

export function previewLink(code: string, now: number): HttpResponse {
  const link = findLink(code);
  if (!link) {
    return notFound();
  }
  if (isExpired(link, now)) {
    return gone(code);
  }
  return page(
    200,
    html`<!doctype html><title>Link preview</title><p>This short link goes to <a href="${link.target}" rel="noreferrer">${link.target}</a></p>`,
  );
}
