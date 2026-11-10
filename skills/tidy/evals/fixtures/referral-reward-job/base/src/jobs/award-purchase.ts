import { ledger } from "../ledger/store.ts";

export interface PurchaseSettled {
  orderId: string;
  memberId: string;
  totalCents: number;
}

const POINTS_PER_DOLLAR = 2;

export async function awardPurchase(payload: PurchaseSettled): Promise<void> {
  const points = Math.floor(payload.totalCents / 100) * POINTS_PER_DOLLAR;
  if (points === 0) return;
  await ledger.credit(payload.memberId, points, "purchase", `purchase:${payload.orderId}`);
}
