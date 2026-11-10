import { readFileSync } from "node:fs";
import { push } from "./commands/push.js";
import { status } from "./commands/status.js";
import { print } from "./output.js";

const COMMANDS = { push, status };

const USAGE = `Usage: petrel <command> [options]

Commands:
  push <manifest>   check a manifest and queue it in the outbox
  status            list batches waiting in the outbox

Options:
  -h, --help        show this help
  -v, --version     show the version`;

function version() {
  const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  return manifest.version;
}

function main(argv) {
  const [name, ...rest] = argv;
  if (!name || name === "-h" || name === "--help") {
    print(USAGE);
    return;
  }
  if (name === "-v" || name === "--version") {
    print(version());
    return;
  }
  const command = COMMANDS[name];
  if (!command) {
    print(`error: unknown command "${name}"`);
    print(USAGE);
    process.exit(1);
  }
  try {
    command(rest);
  } catch (error) {
    print(`error: ${error.message}`);
    process.exit(1);
  }
}

main(process.argv.slice(2));
