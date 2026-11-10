import assert from "node:assert/strict";
import { test } from "node:test";
import { ZONE_MULTIPLIER, billableWeight, rateCents, resetZoneCache, zoneFor } from "./rates.ts";

test("bills volumetric weight when the parcel is bulky", () => {
  assert.equal(billableWeight(1, { lengthCm: 60, widthCm: 40, heightCm: 30 }), 14.5);
});

test("rounds billable weight up to the next half kilo", () => {
  assert.equal(billableWeight(2.1), 2.5);
  assert.equal(billableWeight(2.5), 2.5);
});

test("never bills below the half kilo minimum", () => {
  assert.equal(billableWeight(0.1), 0.5);
});

test("zone multipliers", () => {
  assert.deepEqual(ZONE_MULTIPLIER, {
    local: 1,
    regional: 1.35,
    national: 1.8,
    remote: 2.6,
  });
});

test("rateCents matches the formula", () => {
  const expected = Math.round((450 + 120 * billableWeight(3)) * ZONE_MULTIPLIER.remote);
  assert.equal(rateCents(3, "remote"), expected);
});

test("charges a remote parcel 2.6 times the local rate", () => {
  assert.equal(rateCents(2, "local"), 690);
  assert.equal(rateCents(2, "remote"), 1794);
});

test("zoneFor caches lookups", () => {
  resetZoneCache();
  const first = zoneFor("3141");
  const second = zoneFor("3141");
  assert.equal(first, second);
});

test("resetZoneCache does not throw", () => {
  assert.doesNotThrow(() => resetZoneCache());
});

test("maps postcodes to zones and rejects malformed ones", () => {
  assert.equal(zoneFor("2010"), "local");
  assert.equal(zoneFor("4000"), "regional");
  assert.equal(zoneFor("6000"), "national");
  assert.equal(zoneFor("0870"), "remote");
  assert.throws(() => zoneFor("31A1"), RangeError);
});
