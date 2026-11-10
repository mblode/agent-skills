import assert from "node:assert/strict";
import { test } from "node:test";
import { PLAN_PRICES } from "./plans.ts";
import { creditForDowngrade, prorateUpgrade } from "./proration.ts";

test("charges the price difference for the days left in the period", () => {
  assert.equal(prorateUpgrade("solo", "team", { daysInPeriod: 30, daysRemaining: 10 }), 667);
});

test("charges nothing when no days remain", () => {
  assert.equal(prorateUpgrade("solo", "team", { daysInPeriod: 30, daysRemaining: 0 }), 0);
});

test("rounds a downgrade credit down so the customer is never over credited", () => {
  assert.equal(creditForDowngrade("team", "solo", { daysInPeriod: 30, daysRemaining: 10 }), 666);
});

test("prorateUpgrade returns a number", () => {
  assert.equal(typeof prorateUpgrade("solo", "studio", { daysInPeriod: 31, daysRemaining: 4 }), "number");
});

test("matches the proration formula", () => {
  const period = { daysInPeriod: 31, daysRemaining: 12 };
  const expected = Math.round(((PLAN_PRICES.studio - PLAN_PRICES.team) * period.daysRemaining) / period.daysInPeriod);
  assert.equal(prorateUpgrade("team", "studio", period), expected);
});

test("plan prices", () => {
  assert.deepEqual(PLAN_PRICES, { solo: 900, team: 2900, studio: 7900 });
});
