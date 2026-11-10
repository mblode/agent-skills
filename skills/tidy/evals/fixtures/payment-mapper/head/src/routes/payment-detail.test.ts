import assert from "node:assert/strict";
import { test } from "node:test";
import { getPayment } from "./payment-detail.ts";
import { clientWith } from "./stub-client.ts";

test("returns the normalized payment with its receipt", async () => {
  const stripe = clientWith([
    {
      id: "pi_1",
      amount: 1500,
      currency: "usd",
      status: "succeeded",
      customer: { id: "cus_1" },
      created: 1_750_000_000,
      latest_charge: { receipt_url: "https://pay.orchard.example/receipts/pi_1" },
    },
  ]);
  const response = await getPayment(stripe, "pi_1");
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    id: "pi_1",
    amount: 1500,
    currency: "USD",
    status: "paid",
    customerId: "cus_1",
    createdAt: "2025-06-15T15:06:40.000Z",
    receiptUrl: "https://pay.orchard.example/receipts/pi_1",
  });
});

test("reports an uncaptured payment as authorized with no receipt", async () => {
  const stripe = clientWith([
    { id: "pi_2", amount: 700, currency: "eur", status: "requires_capture", customer: null, created: 1_750_000_000, latest_charge: null },
  ]);
  const response = await getPayment(stripe, "pi_2");
  assert.equal(response.body.status, "authorized");
  assert.equal(response.body.customerId, null);
  assert.equal(response.body.receiptUrl, null);
});
