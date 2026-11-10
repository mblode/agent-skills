import assert from "node:assert/strict";
import { test } from "node:test";
import { verifySignature } from "./verify.ts";

const SECRET = "local-signing-key";
const BODY = '{"id":"evt_1042","type":"parcel.delivered","payload":{"parcelId":"pcl_77"}}';
const SIGNATURE = "a5d93a6f2d83d1744ad1ba05e4757607ac38e29739ccb6724e03caada5740275";

test("accepts the signature the carrier computed for the body", () => {
  assert.equal(verifySignature(BODY, `sha256=${SIGNATURE}`, SECRET), true);
});

test("rejects a body that was changed after signing", () => {
  const tampered = BODY.replace("pcl_77", "pcl_78");
  assert.equal(verifySignature(tampered, `sha256=${SIGNATURE}`, SECRET), false);
});

test("rejects a signature made with another secret", () => {
  assert.equal(verifySignature(BODY, `sha256=${SIGNATURE}`, "some-other-key"), false);
});

test("rejects a missing or unprefixed header", () => {
  assert.equal(verifySignature(BODY, undefined, SECRET), false);
  assert.equal(verifySignature(BODY, SIGNATURE, SECRET), false);
});

test("rejects a truncated signature", () => {
  assert.equal(verifySignature(BODY, `sha256=${SIGNATURE.slice(0, 16)}`, SECRET), false);
  assert.equal(verifySignature(BODY, "sha256=", SECRET), false);
});
