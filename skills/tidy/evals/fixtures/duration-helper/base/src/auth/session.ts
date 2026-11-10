import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const SCRYPT_COST = 2 ** 16;
const SCRYPT_OPTIONS = { N: SCRYPT_COST, r: 8, p: 1, maxmem: 128 * 1024 * 1024 };

export interface StoredPassword {
  salt: string;
  hash: string;
}

export function hashPassword(password: string): StoredPassword {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS).toString("hex");
  return { salt, hash };
}

export function verifyPassword(password: string, stored: StoredPassword): boolean {
  const candidate = scryptSync(password, stored.salt, KEY_LENGTH, SCRYPT_OPTIONS);
  return timingSafeEqual(candidate, Buffer.from(stored.hash, "hex"));
}

export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}
