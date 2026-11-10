import { submitExpense } from "../expenses/submit.ts";
import type { ExpenseDraft } from "../expenses/types.ts";
import { StorageError } from "../receipts/storage.ts";

export interface HttpResponse {
  status: number;
  body: unknown;
}

export async function postExpense(draft: ExpenseDraft): Promise<HttpResponse> {
  if (!Number.isInteger(draft.amountCents) || draft.amountCents <= 0) {
    return { status: 422, body: { error: "amountCents must be a positive whole number" } };
  }
  try {
    const expense = await submitExpense(draft);
    return { status: 201, body: expense };
  } catch (error) {
    if (error instanceof StorageError) {
      return {
        status: 503,
        body: { error: "We could not store your receipt. Nothing was saved, please submit again." },
      };
    }
    throw error;
  }
}
