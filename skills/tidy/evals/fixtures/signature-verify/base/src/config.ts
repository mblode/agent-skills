export function webhookSecret(): string {
  const secret = process.env.SWITCHYARD_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("SWITCHYARD_WEBHOOK_SECRET is not set");
  }
  return secret;
}

export function port(): number {
  return Number(process.env.PORT ?? 4310);
}
