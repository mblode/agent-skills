import type { StripeClient } from "../payments/types.ts";

export async function getPayment(stripe: StripeClient, id: string) {
  const intent = await stripe.retrievePaymentIntent(id);
  return { status: 200, body: { id: intent.id, status: intent.status } };
}
