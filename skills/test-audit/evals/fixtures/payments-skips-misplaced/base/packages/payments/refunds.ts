export type PaymentStatus = "captured" | "partially_refunded" | "refunded";

export interface Payment {
  id: string;
  amountMinor: number;
  refundedMinor: number;
  capturedAt: string;
  status: PaymentStatus;
}

export interface RefundResult {
  ok: boolean;
  payment?: Payment;
  error?: string;
}

const REFUND_WINDOW_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

function daysSince(iso: string, now: Date): number {
  return (now.getTime() - new Date(iso).getTime()) / DAY_MS;
}

export function issueRefund(payment: Payment, amountMinor: number, now: Date = new Date()): RefundResult {
  if (!Number.isInteger(amountMinor) || amountMinor <= 0) {
    return { ok: false, error: "Refund amount must be a positive whole number of minor units." };
  }
  if (payment.status === "refunded") {
    return { ok: false, error: "This payment has already been refunded in full." };
  }
  if (daysSince(payment.capturedAt, now) > REFUND_WINDOW_DAYS) {
    return { ok: false, error: `Refunds close ${REFUND_WINDOW_DAYS} days after capture.` };
  }
  if (amountMinor > payment.amountMinor) {
    return { ok: false, error: "Refund is larger than the amount left on this payment." };
  }
  const refundedMinor = payment.refundedMinor + amountMinor;
  const status: PaymentStatus = refundedMinor >= payment.amountMinor ? "refunded" : "partially_refunded";
  return { ok: true, payment: { ...payment, refundedMinor, status } };
}
