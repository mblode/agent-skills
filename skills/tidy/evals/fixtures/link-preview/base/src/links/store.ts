import type { Link } from "./types.ts";

const links = new Map<string, Link>();

export function saveLink(link: Link): void {
  links.set(link.code, link);
}

export function findLink(code: string): Link | undefined {
  return links.get(code);
}

export function hasLink(code: string): boolean {
  return links.has(code);
}

export function isExpired(link: Link, now: number): boolean {
  return link.expiresAt !== null && link.expiresAt <= now;
}

export function clearLinks(): void {
  links.clear();
}
