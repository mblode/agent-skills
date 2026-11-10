import { readFileSync } from "node:fs";

export function readState(path) {
  const state = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(state.services)) {
    throw new Error(`${path} has no "services" list`);
  }
  return state;
}
