import type { Request, Response } from "express";
import { z } from "zod";
import { InvoiceService } from "./invoiceService";
import { chargeCard } from "./payments";

const service = new InvoiceService();

const bodySchema = z.object({
  region: z.enum(["AU", "NZ", "UK"]),
  paymentMethodId: z.string().min(1),
  lines: z
    .array(
      z.object({
        description: z.string().min(1).max(200),
        quantity: z.number().int().min(1),
        unitPriceCents: z.number().int().min(0),
        taxable: z.boolean(),
      }),
    )
    .min(1),
});

export async function checkout(req: Request, res: Response) {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_body" });
  }
  const { region, lines, paymentMethodId } = parsed.data;

  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPriceCents, 0);
  const taxableSubtotal = lines
    .filter((line) => line.taxable)
    .reduce((sum, line) => sum + line.quantity * line.unitPriceCents, 0);
  const rate = region === "AU" ? 0.1 : region === "NZ" ? 0.15 : 0.2;
  const tax = Math.round(taxableSubtotal * rate);
  const total = subtotal + tax;

  const invoice = await service.createInvoice({
    customerId: req.auth.accountId,
    region,
    lines,
    status: "sent",
  });

  const charge = await chargeCard({ paymentMethodId, amountCents: total, reference: invoice.id });
  if (charge.status === "succeeded") {
    await service.updateInvoiceStatus(invoice.id, "paid");
  }

  return res.status(201).json({ invoiceId: invoice.id, totalCents: total, paid: charge.status === "succeeded" });
}
