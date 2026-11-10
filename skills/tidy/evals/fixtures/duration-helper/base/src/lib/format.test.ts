import assert from "node:assert/strict";
import { test } from "node:test";
import { formatBytes, humanizeMs } from "./format.ts";

test("humanizeMs drops empty units", () => {
  assert.equal(humanizeMs(3_600_000), "1h");
  assert.equal(humanizeMs(3_905_000), "1h 5m 5s");
});

test("humanizeMs never returns an empty label", () => {
  assert.equal(humanizeMs(0), "0s");
  assert.equal(humanizeMs(-250), "0s");
  assert.equal(humanizeMs(400), "0s");
});

test("formatBytes picks the largest whole unit", () => {
  assert.equal(formatBytes(512), "512 B");
  assert.equal(formatBytes(1536), "1.5 KB");
});
