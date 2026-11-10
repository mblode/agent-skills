import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { sendDigest } from "./sender.ts";
import type { Digest, Transport } from "./types.ts";

const digest: Digest = { sendAt: new Date("2026-04-14T12:00:00Z"), lines: ["db-primary: cpu 97%", "queue: lag 55s"] };

function flakyTransport(failures: number) {
  const sent: string[] = [];
  let calls = 0;
  const transport: Transport = {
    async deliver(recipient, body) {
      calls += 1;
      if (calls <= failures) {
        throw new Error("connection reset");
      }
      sent.push(`${recipient}\n${body}`);
    },
  };
  return { transport, sent };
}

test("retries once after a failed send and delivers on the second try", async () => {
  const { transport, sent } = flakyTransport(1);
  const report = await sendDigest(transport, "oncall@wren.example", digest);
  assert.deepEqual(report, { delivered: true, attempts: 2 });
  assert.deepEqual(sent, ["oncall@wren.example\ndb-primary: cpu 97%\nqueue: lag 55s"]);
});

test("reports the failure after the second failed send", async () => {
  const { transport, sent } = flakyTransport(2);
  const report = await sendDigest(transport, "oncall@wren.example", digest);
  assert.deepEqual(report, { delivered: false, attempts: 2, error: "connection reset" });
  assert.deepEqual(sent, []);
});

test("skips the transport for an empty digest", async () => {
  const { transport, sent } = flakyTransport(0);
  const report = await sendDigest(transport, "oncall@wren.example", { ...digest, lines: [] });
  assert.deepEqual(report, { delivered: false, attempts: 0 });
  assert.deepEqual(sent, []);
});

test("send calls transport.deliver with the payload", async () => {
  const deliver = mock.fn(async () => {});
  await sendDigest({ deliver }, "oncall@wren.example", digest);
  assert.deepEqual(deliver.mock.calls[0].arguments, ["oncall@wren.example", "db-primary: cpu 97%\nqueue: lag 55s"]);
});

test("transport mock records deliveries", async () => {
  const deliver = mock.fn(async () => {});
  await deliver("oncall@wren.example", "hello");
  assert.equal(deliver.mock.callCount(), 1);
});
