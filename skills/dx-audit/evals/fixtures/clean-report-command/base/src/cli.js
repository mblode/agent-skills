import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { UsageError } from "./errors.js";
import { bold, money, table } from "./format.js";
import { readExpenses, summarise } from "./report.js";

const USAGE = `Usage: tally report <file.csv | -> [options]

Print totals per category for an expense export.

Options:
  --json          print the summary as JSON
  -h, --help      show this help
  -v, --version   show the version

Examples:
  tally report data/march.csv
  cat data/march.csv | tally report - --json`;

const OPTIONS = {
  json: { type: "boolean", default: false },
  help: { type: "boolean", short: "h", default: false },
  version: { type: "boolean", short: "v", default: false },
};

function parse(argv) {
  try {
    return parseArgs({ args: argv, options: OPTIONS, allowPositionals: true });
  } catch (error) {
    throw new UsageError(error.message);
  }
}

function report(path, flags) {
  if (!path) {
    throw new UsageError("report needs a CSV path, for example: tally report data/march.csv");
  }
  const summary = summarise(readExpenses(path));
  if (flags.json) {
    console.log(JSON.stringify(summary));
    return;
  }
  const rows = summary.categories.map((entry) => [entry.name, money(entry.total)]);
  console.log(table([...rows, [bold("total"), money(summary.total)]]));
  console.error(`${summary.count} expenses read from ${path}`);
}

export async function run(argv) {
  try {
    const { values, positionals } = parse(argv);
    if (values.version) {
      const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
      console.log(manifest.version);
      return;
    }
    const [command, path] = positionals;
    if (values.help || !command) {
      console.log(USAGE);
      return;
    }
    if (command !== "report") {
      throw new UsageError(`unknown command "${command}". The only command is "report".`);
    }
    report(path, values);
  } catch (error) {
    if (wantsJson(argv)) {
      console.error(JSON.stringify({ error: { name: error.name, message: error.message } }));
    } else {
      console.error(`tally: ${error.message}`);
      if (error.name === "UsageError") {
        console.error(`\n${USAGE}`);
      }
    }
    process.exitCode = error.exitCode ?? 1;
  }
}

function wantsJson(argv) {
  return argv.includes("--json");
}
