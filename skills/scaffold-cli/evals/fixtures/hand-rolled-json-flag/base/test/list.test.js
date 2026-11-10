import assert from "node:assert/strict";
import { test } from "node:test";
import { selectNotes } from "../src/commands/list.js";
import { formatNotes } from "../src/format.js";

const notes = [
  { id: 1, tag: "fix", text: "Retry uploads", addedAt: "2026-08-03" },
  { id: 2, tag: "feature", text: "Export invoices", addedAt: "2026-08-11" },
];

test("keeps only notes with the requested tag", () => {
  assert.deepEqual(selectNotes(notes, "fix"), [notes[0]]);
});

test("prints one aligned line per note", () => {
  assert.equal(formatNotes(notes), "#1   2026-08-03  [fix] Retry uploads\n#2   2026-08-11  [feature] Export invoices");
});

test("says so when there is nothing to list", () => {
  assert.equal(formatNotes([]), "no notes yet");
});
