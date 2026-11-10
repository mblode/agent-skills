import assert from "node:assert/strict";
import { test } from "node:test";
import { loadState, parseInterval, serializeState } from "./interval.ts";

test("parses minutes, hours and days", () => {
  assert.equal(parseInterval("every 15m"), 900_000);
  assert.equal(parseInterval("every 2h"), 7_200_000);
  assert.equal(parseInterval("every 1d"), 86_400_000);
});

test("rejects a zero interval", () => {
  assert.throws(() => parseInterval("every 0m"), RangeError);
});

test("rejects text it cannot read", () => {
  assert.throws(() => parseInterval("hourly"), SyntaxError);
});

test("state file contains next_run_at", () => {
  const text = serializeState({ jobId: "nightly", nextRunAt: new Date("2026-05-02T03:00:00Z") });
  assert.match(text, /"next_run_at":"2026-05-02T03:00:00.000Z"/);
});

test("reads a state file written by an earlier release", () => {
  const state = loadState('{"job_id":"nightly","next_run_at":"2025-12-31T23:00:00.000Z"}');
  assert.equal(state.jobId, "nightly");
  assert.equal(state.nextRunAt.getTime(), Date.UTC(2025, 11, 31, 23));
});

test("parseInterval is exported", () => {
  assert.equal(typeof parseInterval, "function");
});
