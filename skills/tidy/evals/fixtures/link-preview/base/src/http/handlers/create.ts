import { randomInt } from "node:crypto";
import { hasLink, saveLink } from "../../links/store.ts";
import { json } from "../response.ts";
import type { HttpResponse } from "../response.ts";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const CODE_LENGTH = 6;
const MAX_TARGET_LENGTH = 2048;
const MAX_TTL_DAYS = 365;
const DAY_MS = 24 * 60 * 60 * 1000;

function newCode(): string {
  let code = "";
  do {
    code = "";
    for (let index = 0; index < CODE_LENGTH; index += 1) {
      code += ALPHABET[randomInt(ALPHABET.length)];
    }
  } while (hasLink(code));
  return code;
}

function parseTarget(value: unknown): string | null {
  if (typeof value !== "string" || value.length > MAX_TARGET_LENGTH) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return url.href;
}

export function createLink(body: unknown, now: number): HttpResponse {
  if (typeof body !== "object" || body === null) {
    return json(422, { error: "body must be an object" });
  }
  const { target: rawTarget, ttlDays } = body as Record<string, unknown>;

  const target = parseTarget(rawTarget);
  if (target === null) {
    return json(422, { error: "target must be an http or https URL" });
  }

  let expiresAt: number | null = null;
  if (ttlDays !== undefined) {
    if (typeof ttlDays !== "number" || !Number.isInteger(ttlDays) || ttlDays < 1 || ttlDays > MAX_TTL_DAYS) {
      return json(422, { error: `ttlDays must be a whole number from 1 to ${MAX_TTL_DAYS}` });
    }
    expiresAt = now + ttlDays * DAY_MS;
  }

  const code = newCode();
  saveLink({ code, target, createdAt: now, expiresAt });
  return json(201, { code, target, expiresAt });
}
