import { existsSync, readFileSync, writeFileSync } from "node:fs";

export function readNotes(path) {
  if (!existsSync(path)) {
    return [];
  }
  const notes = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(notes)) {
    throw new Error(`${path} should hold a JSON array of notes`);
  }
  return notes;
}

export function writeNotes(path, notes) {
  writeFileSync(path, `${JSON.stringify(notes, null, 2)}\n`);
}
