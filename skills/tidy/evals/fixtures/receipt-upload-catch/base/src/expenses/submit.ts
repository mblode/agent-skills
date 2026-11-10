import { saveReceipt } from "../receipts/save.ts";
import { discardUpload, readUpload } from "../uploads/temp.ts";
import { insertExpense } from "./store.ts";
import type { Expense, ExpenseDraft } from "./types.ts";

export async function submitExpense(draft: ExpenseDraft): Promise<Expense> {
  let receiptKey: string | null = null;
  if (draft.uploadId) {
    const saved = await saveReceipt(readUpload(draft.uploadId));
    receiptKey = saved.receiptKey;
  }

  const expense = insertExpense({
    employeeId: draft.employeeId,
    amountCents: draft.amountCents,
    description: draft.description,
    receiptKey,
    status: "submitted",
  });

  if (draft.uploadId) {
    discardUpload(draft.uploadId);
  }
  return expense;
}
