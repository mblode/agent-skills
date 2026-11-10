import type { StripeClient } from "../payments/types.ts";

export async function listCustomerPayments(stripe: StripeClient, customerId: string) {
  const intents = await stripe.listPaymentIntents(customerId);
  return { status: 200, body: { payments: intents.map((intent) => ({ id: intent.id, status: intent.status })) } };
}
