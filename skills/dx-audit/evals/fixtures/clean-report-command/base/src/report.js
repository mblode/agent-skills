import { readFileSync } from "node:fs";
import { InputError } from "./errors.js";

const READ_REASONS = {
  ENOENT: "no such file",
  EISDIR: "it is a directory",
  EACCES: "permission denied",
};
const AMOUNT = /^-?\d+(\.\d{1,2})?$/;

function readText(path) {
  try {
    return path === "-" ? readFileSync(0, "utf8") : readFileSync(path, "utf8");
  } catch (cause) {
    const reason = READ_REASONS[cause.code] ?? cause.message;
    throw new InputError(
      "ERR_UNREADABLE_INPUT",
      `cannot read ${path === "-" ? "standard input" : path}: ${reason}. Pass the path to a CSV export, or "-" to read standard input.`,
      { path, reason: cause.code ?? null },
      { cause },
    );
  }
}

// Splits one CSV line, honouring double-quoted cells and "" as an escaped quote.
function splitLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted && char === '"' && line[i + 1] === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell.trim());
  return cells;
}

function toCents(text) {
  const [whole, fraction = ""] = text.replace("-", "").split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return text.startsWith("-") ? -cents : cents;
}

export function readExpenses(path) {
  const source = path === "-" ? "standard input" : path;
  const rows = readText(path)
    .split(/\r?\n/)
    .map((text, index) => ({ text, line: index + 1 }))
    .filter((row) => row.text.trim() !== "");
  if (rows.length === 0) {
    throw new InputError(
      "ERR_EMPTY_INPUT",
      `${source} is empty. Expected a CSV with a header row naming "category" and "amount" columns.`,
      { path },
    );
  }
  const [header, ...records] = rows;
  const columns = splitLine(header.text).map((name) => name.toLowerCase());
  const category = columns.indexOf("category");
  const amount = columns.indexOf("amount");
  if (category === -1 || amount === -1) {
    const missing = ["category", "amount"].filter((name) => !columns.includes(name));
    throw new InputError(
      "ERR_MISSING_COLUMN",
      `${source} line ${header.line}: missing column ${missing.map((name) => `"${name}"`).join(" and ")}, found: ${columns.join(", ")}. Add the column to the header row.`,
      { path, line: header.line, missing, found: columns },
    );
  }
  return records.map(({ text, line }) => {
    const cells = splitLine(text);
    const fail = (message, details) => {
      throw new InputError("ERR_INVALID_ROW", `${source} line ${line}: ${message}`, { path, line, ...details });
    };
    if (cells.length !== columns.length) {
      fail(`expected ${columns.length} cells to match the header, found ${cells.length}. Quote any cell that contains a comma.`, {
        expected: columns.length,
        found: cells.length,
      });
    }
    if (cells[category] === "") {
      fail(`"category" is empty. Give every row a category.`, { column: "category", value: "" });
    }
    if (!AMOUNT.test(cells[amount])) {
      fail(`amount ${JSON.stringify(cells[amount])} is not a plain decimal such as 42.10. Remove currency symbols and thousands separators.`, {
        column: "amount",
        value: cells[amount],
      });
    }
    return { category: cells[category], cents: toCents(cells[amount]) };
  });
}

export function summarise(expenses) {
  const totals = new Map();
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.cents);
  }
  const categories = [...totals]
    .map(([name, cents]) => ({ name, cents }))
    .sort((a, b) => b.cents - a.cents || a.name.localeCompare(b.name));
  const cents = categories.reduce((sum, entry) => sum + entry.cents, 0);
  return { count: expenses.length, cents, categories };
}
