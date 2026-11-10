import assert from "node:assert/strict";
import { it } from "node:test";
import { formatMinor, fromMinor, toMinor } from "./currency.ts";

it("converts dollars to cents", () => {
  assert.equal(toMinor(12.34, "USD"), 1234);
});

it("converts cents back to dollars", () => {
  assert.equal(fromMinor(1234, "USD"), 12.34);
});

it("formats a euro amount with two decimals", () => {
  assert.equal(formatMinor(500, "EUR"), "EUR 5.00");
});
