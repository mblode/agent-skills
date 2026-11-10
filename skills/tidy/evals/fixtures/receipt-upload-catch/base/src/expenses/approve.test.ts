import assert from "node:assert/strict";
import { test } from "node:test";
import { approveExpense } from "./approve.ts";
import { insertExpense } from "./store.ts";

const base = { employeeId: "emp_31", description: "Client dinner", status: "submitted" as const };

test("approves a small expense without a receipt", () => {
  const expense = insertExpense({ ...base, amountCents: 1_850, receiptKey: null });
  assert.equal(approveExpense(expense.id).status, "approved");
});

test("refuses a large expense that has no receipt", () => {
  const expense = insertExpense({ ...base, amountCents: 12_400, receiptKey: null });
  assert.throws(() => approveExpense(expense.id), /needs a receipt/);
});

test("approves a large expense once a receipt is attached", () => {
  const expense = insertExpense({ ...base, amountCents: 12_400, receiptKey: "up_9/dinner.pdf" });
  assert.equal(approveExpense(expense.id).status, "approved");
});
