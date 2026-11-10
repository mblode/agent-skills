import assert from "node:assert/strict";
import { test } from "node:test";
import { listCustomerPayments } from "./customer-payments.ts";
import { clientWith } from "./stub-client.ts";

test("lists only the customer's payments", async () => {
  const stripe = clientWith([
    { id: "pi_1", amount: 1500, currency: "usd", status: "succeeded", customer: "cus_1", created: 1_750_000_000, latest_charge: null },
    { id: "pi_2", amount: 900, currency: "usd", status: "canceled", customer: "cus_2", created: 1_750_000_100, latest_charge: null },
  ]);
  const response = await listCustomerPayments(stripe, "cus_1");
  assert.deepEqual(response.body.payments.map((payment) => payment.id), ["pi_1"]);
});
