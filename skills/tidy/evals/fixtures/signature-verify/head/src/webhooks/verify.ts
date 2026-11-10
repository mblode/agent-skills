import { createHmac } from "node:crypto";

const HEX_DIGITS = "0123456789abcdef";
const PREFIX = "sha256=";

function toHex(bytes: Uint8Array): string {
  let out = "";
  for (let index = 0; index < bytes.length; index += 1) {
    const byte = bytes[index];
    out += HEX_DIGITS[byte >> 4];
    out += HEX_DIGITS[byte & 15];
  }
  return out;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return difference === 0;
}

export function verifySignature(rawBody: string, header: string | undefined, secret: string): boolean {
  if (!header || !header.startsWith(PREFIX)) {
    return false;
  }
  const received = header.slice(PREFIX.length);
  const expected = toHex(createHmac("sha256", secret).update(rawBody).digest());
  return constantTimeEqual(expected, received);
}
