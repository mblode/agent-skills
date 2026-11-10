import assert from "node:assert/strict";
import { test } from "node:test";
import { hashPassword, newSessionToken, verifyPassword } from "./session.ts";

test("verifyPassword accepts the original password only", () => {
  const stored = hashPassword("correct horse battery staple");
  assert.equal(verifyPassword("correct horse battery staple", stored), true);
  assert.equal(verifyPassword("correct horse battery stable", stored), false);
});

test("login stays inside the 20ms budget", () => {
  const stored = hashPassword("hunter2-but-longer");
  const started = performance.now();
  verifyPassword("hunter2-but-longer", stored);
  const elapsed = performance.now() - started;
  assert.ok(elapsed < 20, `verifyPassword took ${elapsed.toFixed(1)}ms`);
});

test("session tokens are unique", () => {
  assert.notEqual(newSessionToken(), newSessionToken());
});
