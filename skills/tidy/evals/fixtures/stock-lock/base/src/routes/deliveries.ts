import { receiveDelivery } from "../stock/restock.ts";

export interface DeliveryBody {
  lines?: Array<{ sku?: unknown; quantity?: unknown }>;
}

export async function postDelivery(body: DeliveryBody): Promise<{ status: number; body: unknown }> {
  const lines = body.lines ?? [];
  const valid = lines.every(
    (line) => typeof line.sku === "string" && Number.isInteger(line.quantity) && (line.quantity as number) > 0,
  );
  if (lines.length === 0 || !valid) {
    return { status: 422, body: { error: "each line needs a sku and a positive quantity" } };
  }
  const levels = await Promise.all(
    lines.map((line) => receiveDelivery(line.sku as string, line.quantity as number)),
  );
  return { status: 200, body: { levels } };
}
