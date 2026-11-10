import { readFileSync } from "node:fs";

const KINDS = new Set(["vessel", "berth", "crew"]);

export function readManifest(path) {
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    throw new Error(`cannot read manifest at ${path}`);
  }
  let manifest;
  try {
    manifest = JSON.parse(text);
  } catch {
    throw new Error(`${path} is not valid JSON`);
  }
  if (typeof manifest.workspace !== "string" || manifest.workspace === "") {
    throw new Error(`${path} needs a "workspace" name`);
  }
  if (!Array.isArray(manifest.records) || manifest.records.length === 0) {
    throw new Error(`${path} has no records to push`);
  }
  for (const record of manifest.records) {
    if (!KINDS.has(record.kind)) {
      throw new Error(`record ${record.id} has unknown kind "${record.kind}" (expected vessel, berth or crew)`);
    }
  }
  return manifest;
}
