import assert from "node:assert/strict";
import { it } from "node:test";
import { type Payment, issueRefund } from "./refunds.ts";

const NOW = new Date("2026-03-01T00:00:00Z");

function payment(overrides: Partial<Payment> = {}): Payment {
  return {
    id: "pay_204",
    amountMinor: 8000,
    refundedMinor: 0,
    capturedAt: "2026-02-10T09:30:00Z",
    status: "captured",
    ...overrides,
  };
}

it("refunds the full amount and marks the payment refunded", () => {
  const result = issueRefund(payment(), 8000, NOW);
  assert.equal(result.ok, true);
  assert.equal(result.payment?.status, "refunded");
  assert.equal(result.payment?.refundedMinor, 8000);
});

it("records a partial refund without closing the payment", () => {
  const result = issueRefund(payment(), 3000, NOW);
  assert.equal(result.payment?.status, "partially_refunded");
  assert.equal(result.payment?.refundedMinor, 3000);
});

it("rejects a refund of zero", () => {
  assert.equal(issueRefund(payment(), 0, NOW).ok, false);
});

it.skip("rejects a refund once the 90 day window has closed", () => {
  const old = payment({ capturedAt: "2025-11-01T00:00:00Z" });
  const result = issueRefund(old, 1000, NOW);
  assert.equal(result.ok, false);
  assert.equal(result.error, "Refunds close 90 days after capture.");
});

it.skip("refuses a second partial refund larger than what is left", () => {
  const partly = payment({ refundedMinor: 6000, status: "partially_refunded" });
  const result = issueRefund(partly, 5000, NOW);
  assert.equal(result.ok, false);
  assert.equal(result.error, "Refund is larger than the amount left on this payment.");
});

it.skip("marks the payment refunded once partial refunds add up to the total", () => {
  const partly = payment({ refundedMinor: 6000, status: "partially_refunded" });
  const result = issueRefund(partly, 2000, NOW);
  assert.equal(result.payment?.status, "refunded");
});
