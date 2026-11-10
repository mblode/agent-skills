import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUTBOX = join(".relay", "outbox");

export async function enqueue(message) {
  const entry = { id: randomUUID().slice(0, 8), queuedAt: new Date().toISOString(), ...message };
  await mkdir(OUTBOX, { recursive: true });
  await writeFile(join(OUTBOX, `${entry.id}.json`), JSON.stringify(entry, null, 2));
  return entry;
}
