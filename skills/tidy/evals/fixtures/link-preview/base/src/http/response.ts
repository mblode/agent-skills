import { html } from "./html.ts";

export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

const HTML_HEADERS = { "content-type": "text/html; charset=utf-8" };

export function page(status: number, body: string): HttpResponse {
  return { status, headers: { ...HTML_HEADERS }, body };
}

export function json(status: number, value: unknown): HttpResponse {
  return { status, headers: { "content-type": "application/json" }, body: JSON.stringify(value) };
}

export function notFound(): HttpResponse {
  return page(404, html`<!doctype html><title>Not found</title><p>There is no link here.</p>`);
}

export function gone(code: string): HttpResponse {
  return page(410, html`<!doctype html><title>Expired</title><p>The link ${code} has expired.</p>`);
}
