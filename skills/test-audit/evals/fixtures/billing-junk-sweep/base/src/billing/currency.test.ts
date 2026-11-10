import assert from "node:assert/strict";
import { test } from "node:test";
import * as currency from "./currency.ts";
import { formatMoney, splitEvenly, toMinorUnits } from "./currency.ts";

test("converts dollars to cents without float drift", () => {
  assert.equal(toMinorUnits(19.99, "USD"), 1999);
  assert.equal(toMinorUnits(1.15, "USD"), 115);
});

test("converts yen without a fractional part", () => {
  assert.equal(toMinorUnits(1200, "JPY"), 1200);
});

test("converts dinar with three decimal places", () => {
  assert.equal(toMinorUnits(4.125, "KWD"), 4125);
});

test("splits a total so the parts add back up to the cent", () => {
  assert.deepEqual(splitEvenly(1000, 3), [334, 333, 333]);
});

test("formatMoney formats money", () => {
  assert.equal(formatMoney(1999, "USD"), formatMoney(1999, "USD"));
});

test("converts usd", () => {
  assert.equal(toMinorUnits(10, "USD"), 1000);
});

test("exports", () => {
  assert.deepEqual(Object.keys(currency).sort(), ["formatMoney", "splitEvenly", "toMinorUnits"]);
});
