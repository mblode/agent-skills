import type { PaymentStatus, StripeClient, StripePaymentIntent } from "../payments/types.ts";

function paymentStatus(intent: StripePaymentIntent): PaymentStatus {
  switch (intent.status) {
    case "succeeded":
      return "paid";
    case "canceled":
      return "canceled";
    case "requires_capture":
      return "authorized";
    default:
      return "pending";
  }
}

export async function listCustomerPayments(stripe: StripeClient, customerId: string) {
  const intents = await stripe.listPaymentIntents(customerId);
  const payments = intents.map((intent) => ({
    id: intent.id,
    amount: intent.amount,
    currency: intent.currency.toUpperCase(),
    status: paymentStatus(intent),
    customerId: typeof intent.customer === "string" ? intent.customer : (intent.customer?.id ?? null),
    createdAt: new Date(intent.created * 1000).toISOString(),
  }));
  return { status: 200, body: { payments } };
}
