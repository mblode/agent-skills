import assert from "node:assert/strict";
import { test } from "node:test";
import { replayDay } from "./orders.ts";
import { release, reserve } from "./reserve.ts";
import type { Stock } from "./types.ts";

function shelf(): Stock {
  return new Map([
    ["kettle", { available: 4, reserved: 0 }],
    ["toaster", { available: 1, reserved: 2 }],
  ]);
}

test("replays a full day of orders", () => {
  const stock = shelf();
  const log = replayDay(stock, [
    { kind: "place", sku: "kettle", quantity: 2 },
    { kind: "place", sku: "kettle", quantity: 9 },
    { kind: "place", sku: "blender", quantity: 1 },
    { kind: "place", sku: "toaster", quantity: 0 },
    { kind: "cancel", sku: "toaster", quantity: 1 },
    { kind: "cancel", sku: "blender", quantity: 1 },
    { kind: "cancel", sku: "kettle", quantity: 0 },
  ]);
  assert.equal(log.length, 7);
});

test("moves reserved units out of available", () => {
  const stock = shelf();
  assert.deepEqual(reserve(stock, "kettle", 3), { ok: true });
  assert.deepEqual(stock.get("kettle"), { available: 1, reserved: 3 });
});

test("reserve returns ok for a valid request", () => {
  assert.equal(reserve(shelf(), "kettle", 1).ok, true);
});

test("reserving reduces available", () => {
  const stock = shelf();
  reserve(stock, "kettle", 3);
  assert.equal(stock.get("kettle")?.available, 1);
});

test("refuses to reserve more than is available", () => {
  const stock = shelf();
  assert.deepEqual(reserve(stock, "toaster", 2), { ok: false, reason: "insufficient_stock" });
  assert.deepEqual(stock.get("toaster"), { available: 1, reserved: 2 });
});

test("returns released units to available and never more than were reserved", () => {
  const stock = shelf();
  assert.deepEqual(release(stock, "toaster", 5), { ok: true });
  assert.deepEqual(stock.get("toaster"), { available: 3, reserved: 0 });
});

test("release adds stock back", () => {
  const stock = shelf();
  release(stock, "toaster", 1);
  assert.equal(stock.get("toaster")?.available, 2);
});

test("rejects a sku that is not stocked", () => {
  assert.deepEqual(reserve(shelf(), "blender", 1), { ok: false, reason: "unknown_sku" });
  assert.deepEqual(release(shelf(), "blender", 1), { ok: false, reason: "unknown_sku" });
});

test("unknown sku is rejected", () => {
  assert.equal(reserve(shelf(), "blender", 1).ok, false);
});

test("rejects a quantity that is not a whole number above zero", () => {
  assert.equal(reserve(shelf(), "kettle", 0).reason, "invalid_quantity");
  assert.equal(reserve(shelf(), "kettle", 1.5).reason, "invalid_quantity");
});
