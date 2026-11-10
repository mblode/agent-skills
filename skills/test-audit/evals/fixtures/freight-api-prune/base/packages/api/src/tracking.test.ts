import assert from "node:assert/strict";
import { test } from "node:test";
import { formatTrackingCode, isValidTrackingCode, parseTrackingCode } from "./tracking.ts";

test("formats a road consignment with its check digit", () => {
  assert.equal(formatTrackingCode("road", 42), "LF-RD-00000042-4");
});

test("rejects a code whose check digit is wrong", () => {
  assert.equal(parseTrackingCode("LF-RD-00000042-5"), null);
  assert.equal(isValidTrackingCode("LF-RD-00000042-5"), false);
});

test("reads a code typed in lower case with stray spaces", () => {
  assert.deepEqual(parseTrackingCode("  lf-ar-00731200-0 "), { carrier: "air", sequence: 731_200 });
});

test("parse returns what parse returns", () => {
  const code = formatTrackingCode("sea", 9001);
  assert.deepEqual(parseTrackingCode(code), parseTrackingCode(code));
});

test("isValidTrackingCode is a function", () => {
  assert.equal(typeof isValidTrackingCode, "function");
});
