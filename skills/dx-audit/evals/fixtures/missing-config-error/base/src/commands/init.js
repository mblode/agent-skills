import { copyFileSync, existsSync } from "node:fs";
import { CONFIG_NAME } from "../config.js";

const EXAMPLE = new URL("../../relay.config.example.json", import.meta.url);

export function init() {
  if (existsSync(CONFIG_NAME)) {
    console.error(`relay: ${CONFIG_NAME} already exists, leaving it alone`);
    process.exitCode = 1;
    return;
  }
  copyFileSync(EXAMPLE, CONFIG_NAME);
  console.log(`wrote ${CONFIG_NAME}`);
}
