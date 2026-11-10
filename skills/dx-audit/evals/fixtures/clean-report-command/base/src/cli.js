import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { UsageError } from "./errors.js";
import { bold, money, table } from "./format.js";
import { readExpenses, summarise } from "./report.js";

const USAGE = `Usage: tally report <file.csv | -> [options]

Print totals per category for an expense export.

Examples:
  tally report data/march.csv
  cat data/march.csv | tally report - --json

Options:
  --json          print the summary as JSON on stdout; errors become a JSON object too
  -h, --help      show this help
  -V, --version   show the version

Input:
  A CSV with a header row naming "category" and "amount" columns (any order, other
  columns ignored). Amounts are plain decimals such as 42.10 or -5.00. Cells that
  contain a comma must be double-quoted. Blank lines are skipped.

Exit status:
  0  the report was printed
  1  the input could not be read or a row is invalid
  2  the command line is wrong`;

const OPTIONS = {
  json: { type: "boolean" },
  help: { type: "boolean", short: "h" },
  version: { type: "boolean", short: "V" },
};
const COMMANDS = ["report"];
const HELP_HINT = "Run `tally --help` for usage.";

function distance(a, b) {
  let row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const next = [i];
    for (let j = 1; j <= b.length; j += 1) {
      next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    row = next;
  }
  return row[b.length];
}

function closest(word, candidates) {
  return candidates.filter((candidate) => distance(word, candidate) <= 2);
}

function unknown(kind, code, word, candidates) {
  const suggestions = closest(word, candidates);
  const hint = suggestions.length > 0 ? `Did you mean ${suggestions.map((name) => `"${name}"`).join(" or ")}?` : HELP_HINT;
  return new UsageError(code, `unknown ${kind} "${word}". ${hint}`, { [kind]: word, suggestions });
}

function parse(argv) {
  const { tokens } = parseArgs({ args: argv, options: OPTIONS, allowPositionals: true, strict: false, tokens: true });
  const flags = {};
  const positionals = [];
  const longNames = Object.keys(OPTIONS).map((name) => `--${name}`);
  for (const token of tokens) {
    if (token.kind === "positional") {
      positionals.push(token.value);
    } else if (token.kind === "option") {
      if (!(token.name in OPTIONS)) {
        throw unknown("option", "ERR_UNKNOWN_OPTION", token.rawName, longNames);
      }
      if (token.value !== undefined) {
        throw new UsageError("ERR_UNEXPECTED_VALUE", `${token.rawName} does not take a value, received "${token.value}". Pass ${token.rawName} on its own.`, {
          option: token.rawName,
          value: token.value,
        });
      }
      flags[token.name] = true;
    }
  }
  return { flags, positionals };
}

function report(paths, flags) {
  if (paths.length !== 1) {
    const received = paths.length === 0 ? "none" : paths.join(", ");
    throw new UsageError("ERR_PATH_COUNT", `report takes exactly one CSV path, received ${received}. Example: tally report data/march.csv`, { paths });
  }
  const [path] = paths;
  if (path === "-" && process.stdin.isTTY) {
    throw new UsageError("ERR_NO_PIPED_INPUT", `"-" reads standard input, but nothing is piped in. Example: cat data/march.csv | tally report -`, { path });
  }
  const summary = summarise(readExpenses(path));
  if (flags.json) {
    console.log(
      JSON.stringify({
        count: summary.count,
        total: summary.cents / 100,
        categories: summary.categories.map((entry) => ({ name: entry.name, total: entry.cents / 100 })),
      }),
    );
    return;
  }
  const lines = table([...summary.categories.map((entry) => [entry.name, money(entry.cents)]), ["total", money(summary.cents)]]);
  lines.push(bold(lines.pop()));
  console.log(lines.join("\n"));
  console.error(`${summary.count} ${summary.count === 1 ? "expense" : "expenses"} read from ${path === "-" ? "standard input" : path}`);
}

export async function run(argv) {
  try {
    const { flags, positionals } = parse(argv);
    if (flags.version) {
      const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
      console.log(manifest.version);
      return;
    }
    const [command, ...paths] = positionals;
    if (flags.help || !command) {
      console.log(USAGE);
      return;
    }
    if (!COMMANDS.includes(command)) {
      throw unknown("command", "ERR_UNKNOWN_COMMAND", command, COMMANDS);
    }
    report(paths, flags);
  } catch (error) {
    const code = error.code ?? "ERR_INTERNAL";
    if (wantsJson(argv)) {
      console.log(JSON.stringify({ error: true, code, name: error.name, message: error.message, details: error.details ?? {} }));
    } else {
      console.error(`tally: ${error.message}`);
    }
    if (error.exitCode === 2 && !error.message.includes(HELP_HINT)) {
      console.error(HELP_HINT);
    }
    process.exitCode = error.exitCode ?? 1;
  }
}

// Only arguments before a bare "--" are flags; after it "--json" is a file name.
function wantsJson(argv) {
  const end = argv.indexOf("--");
  return (end === -1 ? argv : argv.slice(0, end)).includes("--json");
}
