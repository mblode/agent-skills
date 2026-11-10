import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { setTransport } from "../mail/send.ts";
import type { MailMessage } from "../mail/send.ts";
import { addTicket, clearTickets } from "../tickets/store.ts";
import { runScheduledExport } from "./schedule.ts";

const sent: MailMessage[] = [];

beforeEach(() => {
  sent.length = 0;
  setTransport(async (message) => {
    sent.push(message);
  });
  clearTickets();
  addTicket({ id: "T-204", subject: "Printer, again", status: "open", requester: "ines@example.com", updatedAt: "2026-02-03T09:12:00Z" });
  addTicket({ id: "T-198", subject: "Reset my password", status: "closed", requester: "tomas@example.com", updatedAt: "2026-02-01T16:40:00Z" });
});

test("mails the open tickets as a dated csv attachment", async () => {
  await runScheduledExport(
    { id: "sch_1", format: "csv", status: "open", recipients: ["leads@example.com"] },
    new Date("2026-02-04T06:00:00Z"),
  );
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0].to, ["leads@example.com"]);
  assert.equal(sent[0].attachment?.filename, "tickets-2026-02-04.csv");
  assert.equal(sent[0].attachment?.content.split("\n").length, 2);
});

test("fails the run when the schedule has no recipients", async () => {
  await assert.rejects(
    runScheduledExport({ id: "sch_2", format: "json", recipients: [] }, new Date("2026-02-04T06:00:00Z")),
    /at least one recipient/,
  );
  assert.equal(sent.length, 0);
});
