import assert from "node:assert/strict";
import { it } from "node:test";
import { toMinor } from "../lib/currency.ts";
import { checkout } from "./checkout.ts";

it("rejects an empty cart", () => {
  assert.deepEqual(checkout([], "USD"), { status: 400, body: { error: "The cart is empty." } });
});

it("rejects a line with a fractional quantity", () => {
  const result = checkout([{ sku: "mug", unitPrice: 14, quantity: 1.5 }], "USD");
  assert.equal(result.status, 400);
});

it("totals the cart lines in minor units", () => {
  const result = checkout(
    [
      { sku: "mug", unitPrice: 14.5, quantity: 2 },
      { sku: "tea", unitPrice: 6.25, quantity: 1 },
    ],
    "USD",
  );
  assert.deepEqual(result, { status: 200, body: { totalMinor: 3525, currency: "USD" } });
});

it("converts dollars to cents", () => {
  assert.equal(toMinor(12.34, "USD"), 1234);
});

it("keeps yen whole", () => {
  assert.equal(toMinor(500, "JPY"), 500);
});

it("checkout is defined", () => {
  assert.equal(typeof checkout, "function");
});
