import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { clearEvents, eventCount } from "./events.ts";
import { handleWebhook } from "./handle.ts";

const BODY = '{"id":"evt_1042","type":"parcel.delivered","payload":{"parcelId":"pcl_77"}}';
const SIGNED = { "x-switchyard-signature": "sha256=a5d93a6f2d83d1744ad1ba05e4757607ac38e29739ccb6724e03caada5740275" };
const SIGNED_GARBAGE = { "x-switchyard-signature": "sha256=2fa41d2e18faa53e01a6cecbb61e0d99492ab801a4c0b77bc29b7cccc3e4af3e" };

beforeEach(() => {
  process.env.SWITCHYARD_WEBHOOK_SECRET = "local-signing-key";
  clearEvents();
});

test("accepts a new event once", () => {
  assert.equal(handleWebhook({ rawBody: BODY, headers: SIGNED }).status, 202);
  assert.equal(handleWebhook({ rawBody: BODY, headers: SIGNED }).status, 200);
  assert.equal(eventCount(), 1);
});

test("answers 400 for a signed body that is not an event", () => {
  assert.equal(handleWebhook({ rawBody: "not json", headers: SIGNED_GARBAGE }).status, 400);
  assert.equal(eventCount(), 0);
});

test("answers 401 without recording when the signature does not match", () => {
  assert.equal(handleWebhook({ rawBody: BODY, headers: SIGNED_GARBAGE }).status, 401);
  assert.equal(handleWebhook({ rawBody: BODY, headers: {} }).status, 401);
  assert.equal(eventCount(), 0);
});
