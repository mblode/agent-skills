import assert from "node:assert/strict";
import { test } from "node:test";
import { canAttach } from "./attachments.ts";
import { PLAN_LIMITS } from "./limits.ts";

test("accepts a file that lands exactly on the storage limit and rejects one byte more", () => {
  const limit = PLAN_LIMITS.starter.storageBytes;
  assert.equal(canAttach("starter", limit - 1_000, 1_000).allowed, true);
  assert.equal(canAttach("starter", limit - 1_000, 1_001).allowed, false);
});

test("pro plan storage limit is 50 GB", () => {
  assert.equal(PLAN_LIMITS.pro.storageBytes, 50 * 1024 ** 3);
});
