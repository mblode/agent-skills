import type { PaymentStatus, StripeClient } from "../payments/types.ts";

export async function getPayment(stripe: StripeClient, id: string) {
  const intent = await stripe.retrievePaymentIntent(id);

  let status: PaymentStatus;
  if (intent.status === "succeeded") {
    status = "paid";
  } else if (intent.status === "canceled") {
    status = "canceled";
  } else if (intent.status === "requires_capture") {
    status = "authorized";
  } else {
    status = "pending";
  }

  let customerId: string | null = null;
  if (typeof intent.customer === "string") {
    customerId = intent.customer;
  } else if (intent.customer) {
    customerId = intent.customer.id;
  }

  return {
    status: 200,
    body: {
      id: intent.id,
      amount: intent.amount,
      currency: intent.currency.toUpperCase(),
      status,
      customerId,
      createdAt: new Date(intent.created * 1000).toISOString(),
      receiptUrl: intent.latest_charge?.receipt_url ?? null,
    },
  };
}
