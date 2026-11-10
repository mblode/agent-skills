import assert from "node:assert/strict";
import { test } from "node:test";
import { fromPaymentIntent } from "./normalize.ts";
import type { StripePaymentIntent } from "./types.ts";

const intent: StripePaymentIntent = {
  id: "pi_1",
  amount: 4200,
  currency: "aud",
  status: "requires_capture",
  customer: { id: "cus_9" },
  created: 1_750_000_000,
  latest_charge: null,
};

test("maps an expanded customer to its id", () => {
  assert.equal(fromPaymentIntent(intent).customerId, "cus_9");
  assert.equal(fromPaymentIntent({ ...intent, customer: null }).customerId, null);
});

test("keeps minor units and upper-cases the currency", () => {
  const payment = fromPaymentIntent(intent);
  assert.equal(payment.amount, 4200);
  assert.equal(payment.currency, "AUD");
  assert.equal(payment.status, "authorized");
  assert.equal(payment.createdAt, "2025-06-15T15:06:40.000Z");
});
