import assert from "node:assert/strict";
import { test } from "node:test";
import { invoiceNumber } from "./number.ts";

test("pads the sequence to five digits", () => {
  assert.equal(invoiceNumber(2026, 42), "INV-2026-00042");
});

test("rejects a zero sequence", () => {
  assert.throws(() => invoiceNumber(2026, 0), RangeError);
});
