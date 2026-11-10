import { readFileSync } from "node:fs";
import { InputError } from "./errors.js";

export function readExpenses(path) {
  let text;
  try {
    text = path === "-" ? readFileSync(0, "utf8") : readFileSync(path, "utf8");
  } catch {
    throw new InputError(`cannot read ${path}. Pass the path to a CSV export, or "-" to read standard input.`);
  }
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const columns = header.split(",");
  const category = columns.indexOf("category");
  const amount = columns.indexOf("amount");
  if (category === -1 || amount === -1) {
    throw new InputError(`${path} needs "category" and "amount" columns, found: ${columns.join(", ")}`);
  }
  return lines.map((line, index) => {
    const cells = line.split(",");
    const value = Number(cells[amount]);
    if (!Number.isFinite(value)) {
      throw new InputError(`${path} line ${index + 2}: amount "${cells[amount]}" is not a number`);
    }
    return { category: cells[category], amount: value };
  });
}

export function summarise(expenses) {
  const totals = new Map();
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
  }
  const categories = [...totals]
    .map(([name, total]) => ({ name, total: Math.round(total * 100) / 100 }))
    .sort((a, b) => b.total - a.total);
  const total = Math.round(categories.reduce((sum, entry) => sum + entry.total, 0) * 100) / 100;
  return { count: expenses.length, total, categories };
}
