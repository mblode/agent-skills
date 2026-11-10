import assert from "node:assert/strict";
import { test } from "node:test";
import { canInviteAgent } from "./agents.ts";

test("counts pending invites against the agent limit", () => {
  assert.equal(canInviteAgent("starter", 1, 1).allowed, true);
  assert.equal(canInviteAgent("starter", 2, 1).allowed, false);
});

test("explains which plan limit was reached", () => {
  assert.equal(canInviteAgent("starter", 3, 0).reason, "The starter plan includes 3 agents.");
});
