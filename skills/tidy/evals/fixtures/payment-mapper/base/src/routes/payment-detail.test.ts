import assert from "node:assert/strict";
import { test } from "node:test";
import { getPayment } from "./payment-detail.ts";
import { clientWith } from "./stub-client.ts";

test("returns the payment status", async () => {
  const stripe = clientWith([
    { id: "pi_1", amount: 1500, currency: "usd", status: "succeeded", customer: "cus_1", created: 1_750_000_000, latest_charge: null },
  ]);
  const response = await getPayment(stripe, "pi_1");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "succeeded");
});
