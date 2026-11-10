import type { Request, Response } from "express";
import { InvoiceService } from "./invoiceService";
import type { InvoiceLine } from "./invoiceRepository";

const service = new InvoiceService();

const TAX_RATES: Record<string, number> = { AU: 0.1, NZ: 0.15, UK: 0.2 };

export async function getInvoice(req: Request, res: Response) {
  const invoice = await service.getInvoice(req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: "not_found" });
  }
  if (invoice.customerId !== req.auth.accountId) {
    return res.status(403).json({ error: "forbidden" });
  }

  let subtotal = 0;
  let tax = 0;
  for (const line of invoice.lines as InvoiceLine[]) {
    const amount = line.quantity * line.unitPriceCents;
    subtotal += amount;
    if (line.taxable) {
      tax += Math.round(amount * TAX_RATES[invoice.region]);
    }
  }

  return res.json({
    id: invoice.id,
    status: invoice.status,
    lines: invoice.lines,
    subtotalCents: subtotal,
    taxCents: tax,
    totalCents: subtotal + tax,
  });
}

export async function voidInvoice(req: Request, res: Response) {
  const invoice = await service.getInvoice(req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: "not_found" });
  }
  if (invoice.customerId !== req.auth.accountId) {
    return res.status(403).json({ error: "forbidden" });
  }
  if (invoice.status === "paid") {
    return res.status(409).json({ error: "already_paid" });
  }
  await service.updateInvoiceStatus(invoice.id, "void");
  return res.status(204).end();
}
