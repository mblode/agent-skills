import assert from "node:assert/strict";
import { test } from "node:test";
import { LeaseHeldError, LeaseTable, unfinishedJobs } from "./lease.ts";

function memoryJournal() {
  const entries: string[] = [];
  return { entries, append: (entry: string) => entries.push(entry) };
}

test("journal order is lease, start, done, release", async () => {
  const journal = memoryJournal();
  await new LeaseTable(journal).runWithLease("nightly", async () => {});
  assert.deepEqual(journal.entries, ["lease:nightly", "start:nightly", "done:nightly", "release:nightly"]);
});

test("releases the lease when the job throws", async () => {
  const journal = memoryJournal();
  const table = new LeaseTable(journal);
  await assert.rejects(
    table.runWithLease("nightly", async () => {
      throw new Error("disk full");
    }),
  );
  assert.deepEqual(journal.entries, ["lease:nightly", "start:nightly", "release:nightly"]);
  await table.runWithLease("nightly", async () => {});
});

test("refuses a second runner while the lease is held", async () => {
  const table = new LeaseTable(memoryJournal());
  let finish = () => {};
  const first = table.runWithLease("nightly", () => new Promise<void>((resolve) => (finish = resolve)));
  await assert.rejects(table.runWithLease("nightly", async () => {}), LeaseHeldError);
  finish();
  await first;
});

test("a journal that ends before release lists the job as unfinished", () => {
  assert.deepEqual(unfinishedJobs(["lease:nightly", "start:nightly"]), ["nightly"]);
  assert.deepEqual(unfinishedJobs(["lease:nightly", "start:nightly", "release:nightly"]), []);
});
