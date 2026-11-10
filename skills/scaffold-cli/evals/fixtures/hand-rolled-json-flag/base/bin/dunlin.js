#!/usr/bin/env node
import { parseArgs } from "node:util";
import { add } from "../src/commands/add.js";
import { list } from "../src/commands/list.js";

const USAGE = `Usage: dunlin <command> [options]

Commands:
  list              print every note
  add <tag> <text>  append a note

Options:
  --file <path>     notes file (default: notes.json)
  --tag <tag>       only list notes with this tag
  -h, --help        show this help`;

function main() {
  let parsed;
  try {
    parsed = parseArgs({
      allowPositionals: true,
      options: {
        file: { type: "string", default: "notes.json" },
        tag: { type: "string" },
        help: { type: "boolean", short: "h", default: false },
      },
    });
  } catch (error) {
    console.error(`dunlin: ${error.message}\n\n${USAGE}`);
    process.exitCode = 2;
    return;
  }
  const [command, ...rest] = parsed.positionals;
  if (parsed.values.help || !command) {
    console.log(USAGE);
    return;
  }
  try {
    if (command === "list") {
      list(parsed.values);
    } else if (command === "add") {
      add(rest, parsed.values);
    } else {
      console.error(`dunlin: unknown command "${command}"\n\n${USAGE}`);
      process.exitCode = 2;
    }
  } catch (error) {
    console.error(`dunlin: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
