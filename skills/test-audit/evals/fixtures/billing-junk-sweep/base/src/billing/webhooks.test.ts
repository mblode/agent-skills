import assert from "node:assert/strict";
import { test } from "node:test";
import { PaymentWebhooks } from "./webhooks.ts";

test("applies a replayed event id only once", () => {
  const webhooks = new PaymentWebhooks();
  const event = { id: "evt_1", invoiceId: "inv_7", amountMinor: 2900 };
  assert.equal(webhooks.handle(event), "applied");
  assert.equal(webhooks.handle(event), "duplicate");
  assert.equal(webhooks.paidFor("inv_7"), 2900);
});

test("adds up two different events for the same invoice", () => {
  const webhooks = new PaymentWebhooks();
  webhooks.handle({ id: "evt_1", invoiceId: "inv_7", amountMinor: 1000 });
  webhooks.handle({ id: "evt_2", invoiceId: "inv_7", amountMinor: 1900 });
  assert.equal(webhooks.paidFor("inv_7"), 2900);
});

test("rejects an event with a negative amount", () => {
  const webhooks = new PaymentWebhooks();
  assert.throws(() => webhooks.handle({ id: "evt_3", invoiceId: "inv_7", amountMinor: -50 }), RangeError);
  assert.equal(webhooks.paidFor("inv_7"), 0);
});

test("returns duplicate when the store says so", () => {
  const webhooks = new PaymentWebhooks({ has: () => true, add: () => {} });
  assert.equal(webhooks.handle({ id: "evt_4", invoiceId: "inv_8", amountMinor: 500 }), "duplicate");
});

test("handle does not throw", () => {
  const webhooks = new PaymentWebhooks();
  webhooks.handle({ id: "evt_5", invoiceId: "inv_9", amountMinor: 100 });
});
