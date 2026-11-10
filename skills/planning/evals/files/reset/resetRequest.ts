import type { Request, Response } from "express";
import { z } from "zod";
import { findAccountByEmail } from "./accounts";
import { createResetToken } from "./resetTokens";
import { mailer } from "./mailer";

const bodySchema = z.object({
  email: z.string().email().max(254),
});

const ACCEPTED = { status: "accepted" } as const;

export async function resetRequest(req: Request, res: Response) {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_email" });
  }

  const email = parsed.data.email.toLowerCase();
  const account = await findAccountByEmail(email);

  if (account) {
    const token = await createResetToken(account.id);
    await mailer.send({
      to: email,
      template: "password-reset",
      data: { token },
    });
  }

  return res.status(202).json(ACCEPTED);
}
