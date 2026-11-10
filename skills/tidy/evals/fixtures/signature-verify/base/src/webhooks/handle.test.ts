import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { clearEvents, eventCount } from "./events.ts";
import { handleWebhook } from "./handle.ts";

const BODY = '{"id":"evt_1042","type":"parcel.delivered","payload":{"parcelId":"pcl_77"}}';

beforeEach(() => {
  clearEvents();
});

test("accepts a new event once", () => {
  assert.equal(handleWebhook({ rawBody: BODY, headers: {} }).status, 202);
  assert.equal(handleWebhook({ rawBody: BODY, headers: {} }).status, 200);
  assert.equal(eventCount(), 1);
});

test("answers 400 for a body that is not an event", () => {
  assert.equal(handleWebhook({ rawBody: "not json", headers: {} }).status, 400);
  assert.equal(eventCount(), 0);
});
