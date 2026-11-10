import assert from "node:assert/strict";
import { test } from "node:test";
import { quoteParcel } from "./quote.ts";

test("returns 422 for a weight of zero", () => {
  const response = quoteParcel({ weightKg: 0, postcode: "3141" });
  assert.equal(response.status, 422);
  assert.deepEqual(response.body, { error: "weightKg must be greater than zero" });
});

test("returns 422 for a malformed postcode", () => {
  const response = quoteParcel({ weightKg: 2, postcode: "31A1" });
  assert.equal(response.status, 422);
  assert.deepEqual(response.body, { error: "postcode must be four digits" });
});

test("quotes a 2 kg regional parcel with the fuel surcharge", () => {
  const response = quoteParcel({ weightKg: 2, postcode: "3141" });
  assert.deepEqual(response, {
    status: 200,
    body: { zone: "regional", rateCents: 932, fuelCents: 75, totalCents: 1007 },
  });
});

test("quote uses the rate module", () => {
  const calls: unknown[][] = [];
  const response = quoteParcel(
    { weightKg: 2, postcode: "3141" },
    {
      zoneFor: () => "regional",
      rateCents: (...args) => {
        calls.push(args);
        return 1000;
      },
    },
  );
  assert.deepEqual(calls, [[2, "regional", undefined]]);
  assert.equal(response.status, 200);
});

test("quotes a 2 kg regional parcel", () => {
  const response = quoteParcel({ weightKg: 2, postcode: "3141" });
  assert.equal(response.status, 200);
});

test("handles a request", () => {
  quoteParcel({ weightKg: 5, postcode: "2010" });
});
