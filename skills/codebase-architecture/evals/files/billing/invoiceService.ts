import { InvoiceRepository, type InvoiceRecord } from "./invoiceRepository";

export class InvoiceService {
  constructor(private readonly repository: InvoiceRepository = new InvoiceRepository()) {}

  async getInvoice(id: string): Promise<InvoiceRecord | null> {
    return this.repository.findById(id);
  }

  async getInvoicesForClient(clientId: string): Promise<InvoiceRecord[]> {
    return this.repository.listForCustomer(clientId);
  }

  async createInvoice(input: Omit<InvoiceRecord, "id" | "createdAt">): Promise<InvoiceRecord> {
    return this.repository.insert(input);
  }

  async updateInvoiceStatus(id: string, status: InvoiceRecord["status"]): Promise<void> {
    return this.repository.setStatus(id, status);
  }
}
