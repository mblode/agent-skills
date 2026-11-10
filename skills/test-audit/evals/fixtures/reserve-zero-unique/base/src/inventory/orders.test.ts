import assert from "node:assert/strict";
import { test } from "node:test";
import { replayDay } from "./orders.ts";

test("marks an order it could not apply as skipped in the log", () => {
  const stock = new Map([["kettle", { available: 1, reserved: 0 }]]);
  const log = replayDay(stock, [
    { kind: "place", sku: "kettle", quantity: 1 },
    { kind: "place", sku: "lamp", quantity: 1 },
  ]);
  assert.deepEqual(log, ["place kettle x1", "place lamp x1 (skipped)"]);
});
