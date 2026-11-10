import type { Expense } from "./types.ts";

const expenses = new Map<string, Expense>();
let sequence = 0;

export function insertExpense(fields: Omit<Expense, "id">): Expense {
  sequence += 1;
  const expense: Expense = { id: `exp_${sequence}`, ...fields };
  expenses.set(expense.id, expense);
  return expense;
}

export function getExpense(id: string): Expense {
  const expense = expenses.get(id);
  if (!expense) {
    throw new Error(`no expense ${id}`);
  }
  return expense;
}

export function updateExpense(id: string, changes: Partial<Omit<Expense, "id">>): Expense {
  const next = { ...getExpense(id), ...changes };
  expenses.set(id, next);
  return next;
}
