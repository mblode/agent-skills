import assert from "node:assert/strict";
import { test } from "node:test";
import { nextDelayMs, resolveConfig } from "./backoff.ts";

const steady = resolveConfig({ jitter: false });

test("maxAttempts is 5 unless configured", () => {
  assert.equal(resolveConfig().maxAttempts, 5);
});

test("doubles the delay on each attempt", () => {
  assert.equal(nextDelayMs(1, steady), 2000);
  assert.equal(nextDelayMs(2, steady), 4000);
  assert.equal(nextDelayMs(3, steady), 8000);
});

test("caps the delay at the ceiling", () => {
  const patient = resolveConfig({ jitter: false, maxAttempts: 12 });
  assert.equal(nextDelayMs(9, patient), 60_000);
});

test("stops retrying after the last attempt", () => {
  assert.equal(nextDelayMs(5, steady), null);
});

test("jitter never shortens the delay below half", () => {
  const jittery = resolveConfig();
  assert.equal(nextDelayMs(2, jittery, () => 0), 2000);
  assert.equal(nextDelayMs(2, jittery, () => 1), 4000);
});
