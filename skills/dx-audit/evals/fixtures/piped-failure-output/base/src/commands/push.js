import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readManifest } from "../manifest.js";
import { print } from "../output.js";

export const OUTBOX = join(".petrel", "outbox");

export function push(args) {
  const [path] = args;
  if (!path) {
    throw new Error("push needs a manifest path, for example: petrel push manifest.json");
  }
  const manifest = readManifest(path);
  mkdirSync(OUTBOX, { recursive: true });
  const batch = `${manifest.workspace}-${manifest.records.length}-${Date.now()}.json`;
  writeFileSync(join(OUTBOX, batch), JSON.stringify(manifest));
  print(`queued ${manifest.records.length} records for ${manifest.workspace}`);
  print(`batch ${batch}`);
}
