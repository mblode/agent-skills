import { existsSync, readdirSync } from "node:fs";
import { print } from "../output.js";
import { OUTBOX } from "./push.js";

export function status() {
  const waiting = existsSync(OUTBOX) ? readdirSync(OUTBOX).filter((name) => name.endsWith(".json")) : [];
  print(`${waiting.length} batch${waiting.length === 1 ? "" : "es"} waiting in ${OUTBOX}`);
  for (const name of waiting) {
    print(`  ${name}`);
  }
}
