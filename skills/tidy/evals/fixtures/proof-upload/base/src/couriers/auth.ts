import { createHash, timingSafeEqual } from "node:crypto";

export interface Courier {
  id: string;
  name: string;
  tokenHash: string;
}

const couriers = new Map<string, Courier>();

export function registerCourier(courier: Courier): void {
  couriers.set(courier.id, courier);
}

function hashToken(token: string): Buffer {
  return createHash("sha256").update(token).digest();
}

export async function authenticateCourier(authorization: string | undefined): Promise<Courier | null> {
  if (!authorization?.startsWith("Bearer ")) return null;
  const presented = hashToken(authorization.slice("Bearer ".length));
  for (const courier of couriers.values()) {
    const expected = Buffer.from(courier.tokenHash, "hex");
    if (expected.length === presented.length && timingSafeEqual(expected, presented)) {
      return courier;
    }
  }
  return null;
}
