import { getExpense, updateExpense } from "./store.ts";
import type { Expense } from "./types.ts";

export const RECEIPT_REQUIRED_FROM_CENTS = 7_500;

export function approveExpense(id: string): Expense {
  const expense = getExpense(id);
  if (expense.status === "approved") {
    return expense;
  }
  if (expense.amountCents >= RECEIPT_REQUIRED_FROM_CENTS && expense.receiptKey === null) {
    throw new Error(`expense ${id} needs a receipt before it can be approved`);
  }
  return updateExpense(id, { status: "approved" });
}
