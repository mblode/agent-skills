import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { addTicket, clearTickets } from "../tickets/store.ts";
import { downloadTickets } from "./download.ts";

beforeEach(() => {
  clearTickets();
  addTicket({ id: "T-204", subject: "Printer, again", status: "open", requester: "ines@example.com", updatedAt: "2026-02-03T09:12:00Z" });
  addTicket({ id: "T-198", subject: "Reset my password", status: "closed", requester: "tomas@example.com", updatedAt: "2026-02-01T16:40:00Z" });
});

test("downloads every ticket as csv, oldest update first", () => {
  const response = downloadTickets({});
  assert.equal(response.status, 200);
  assert.equal(
    response.body,
    [
      "id,subject,status,requester,updated_at",
      "T-198,Reset my password,closed,tomas@example.com,2026-02-01T16:40:00Z",
      'T-204,"Printer, again",open,ines@example.com,2026-02-03T09:12:00Z',
    ].join("\n"),
  );
});

test("filters by status", () => {
  const response = downloadTickets({ status: "open" });
  assert.equal(response.body.split("\n").length, 2);
});

test("answers 400 for a status that does not exist", () => {
  assert.equal(downloadTickets({ status: "archived" }).status, 400);
});

test("downloads json when asked for it", () => {
  const response = downloadTickets({ status: "open", format: "json" });
  assert.equal(response.headers["content-type"], "application/json");
  const parsed = JSON.parse(response.body);
  assert.equal(parsed.count, 1);
  assert.equal(parsed.tickets[0].id, "T-204");
});

test("answers 400 for a format that does not exist", () => {
  assert.equal(downloadTickets({ format: "xlsx" }).status, 400);
});
