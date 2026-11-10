import { parseArgs } from "node:util";
import { rollout } from "./commands/rollout.js";
import { status } from "./commands/status.js";

const USAGE = `Usage: heron <command> [options]

Commands:
  status                    show every service in the cluster
  rollout <service> <tag>   plan a rollout of one service

Options:
  --state <path>   state file to read (default: heron.state.json)
  --json           print status as JSON
  -h, --help       show this help`;

const OPTIONS = {
  state: { type: "string", default: "heron.state.json" },
  json: { type: "boolean", default: false },
  help: { type: "boolean", short: "h", default: false },
};

export async function run(argv) {
  let parsed;
  try {
    parsed = parseArgs({ args: argv, options: OPTIONS, allowPositionals: true });
  } catch (error) {
    console.error(`heron: ${error.message}\n\n${USAGE}`);
    process.exitCode = 2;
    return;
  }
  const [command, ...rest] = parsed.positionals;
  if (parsed.values.help || !command) {
    console.log(USAGE);
    return;
  }
  if (command === "status") {
    status(parsed.values);
    return;
  }
  if (command === "rollout") {
    rollout(rest, parsed.values);
    return;
  }
  console.error(`heron: unknown command "${command}"\n\n${USAGE}`);
  process.exitCode = 2;
}
