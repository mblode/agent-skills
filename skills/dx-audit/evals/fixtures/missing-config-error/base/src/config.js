import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const CONFIG_NAME = "relay.config.json";

export function loadConfig(cwd = process.cwd()) {
  const path = join(cwd, CONFIG_NAME);
  if (!existsSync(path)) {
    return undefined;
  }
  return JSON.parse(readFileSync(path, "utf8"));
}
