#!/usr/bin/env node
import { init } from "../src/commands/init.js";
import { send } from "../src/commands/send.js";

const USAGE = `Usage: relay <command>

Commands:
  init            write relay.config.json from the example
  send <text>     queue a message for the configured endpoint`;

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!command || command === "--help" || command === "-h") {
    console.log(USAGE);
    return;
  }
  if (command === "init") {
    init();
    return;
  }
  if (command === "send") {
    await send(rest);
    return;
  }
  console.error(`relay: unknown command "${command}"\n\n${USAGE}`);
  process.exitCode = 2;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
