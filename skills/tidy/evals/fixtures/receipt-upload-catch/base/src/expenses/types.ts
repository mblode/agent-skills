export type ExpenseStatus = "submitted" | "approved";

export interface Expense {
  id: string;
  employeeId: string;
  amountCents: number;
  description: string;
  receiptKey: string | null;
  status: ExpenseStatus;
}

export interface ExpenseDraft {
  employeeId: string;
  amountCents: number;
  description: string;
  uploadId?: string;
}
