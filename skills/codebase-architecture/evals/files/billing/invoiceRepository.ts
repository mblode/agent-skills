import { db } from "./db";

export type InvoiceLine = {
  description: string;
  quantity: number;
  unitPriceCents: number;
  taxable: boolean;
};

export type InvoiceRecord = {
  id: string;
  customerId: string;
  region: "AU" | "NZ" | "UK";
  lines: InvoiceLine[];
  status: "draft" | "sent" | "paid" | "void";
  createdAt: string;
};

export class InvoiceRepository {
  async findById(id: string): Promise<InvoiceRecord | null> {
    return db.invoices.findOne({ id });
  }

  async listForCustomer(customerId: string): Promise<InvoiceRecord[]> {
    return db.invoices.find({ customerId }, { orderBy: "createdAt desc" });
  }

  async insert(record: Omit<InvoiceRecord, "id" | "createdAt">): Promise<InvoiceRecord> {
    return db.invoices.insert(record);
  }

  async setStatus(id: string, status: InvoiceRecord["status"]): Promise<void> {
    await db.invoices.update({ id }, { status });
  }
}
