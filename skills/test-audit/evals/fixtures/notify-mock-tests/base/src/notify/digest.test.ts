import assert from "node:assert/strict";
import { test } from "node:test";
import { __setDedupeForTests, __setNowForTests, buildDigest, currentTime } from "./digest.ts";
import type { Alert } from "./types.ts";

function alert(resource: string, message: string, minute: number): Alert {
  return { resource, message, raisedAt: new Date(Date.UTC(2026, 3, 14, 10, minute)) };
}

const NOON = new Date("2026-04-14T12:00:00Z");

test("collapses repeated alerts for one resource into its latest message", () => {
  const digest = buildDigest(
    [alert("db-primary", "cpu 91%", 1), alert("api-gateway", "5xx spike", 2), alert("db-primary", "cpu 97%", 9)],
    NOON,
  );
  assert.deepEqual(digest.lines, ["api-gateway: 5xx spike", "db-primary: cpu 97%"]);
});

test("holds a digest raised inside quiet hours until they end", () => {
  const late = new Date("2026-04-14T23:30:00Z");
  const digest = buildDigest([alert("db-primary", "cpu 91%", 1)], late, { startHour: 22, endHour: 7 });
  assert.equal(digest.sendAt.toISOString(), "2026-04-15T07:00:00.000Z");
});

test("sends straight away outside quiet hours", () => {
  const digest = buildDigest([alert("db-primary", "cpu 91%", 1)], NOON, { startHour: 22, endHour: 7 });
  assert.equal(digest.sendAt, NOON);
});

test("dedupes notifications", () => {
  __setDedupeForTests((alerts) => {
    const seen = new Set<string>();
    return alerts.filter((item) => {
      if (seen.has(item.resource)) {
        return false;
      }
      seen.add(item.resource);
      return true;
    });
  });
  const digest = buildDigest([alert("queue", "lag 40s", 1), alert("queue", "lag 55s", 2)], NOON);
  assert.equal(digest.lines.length, 1);
});

test("uses the injected clock", () => {
  __setNowForTests(() => NOON);
  assert.equal(currentTime(), NOON);
});
