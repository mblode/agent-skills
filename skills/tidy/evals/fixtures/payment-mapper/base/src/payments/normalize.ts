import type { Payment, PaymentStatus, StripeIntentStatus, StripePaymentIntent } from "./types.ts";

const STATUS: Record<StripeIntentStatus, PaymentStatus> = {
  requires_payment_method: "pending",
  requires_confirmation: "pending",
  requires_action: "pending",
  processing: "pending",
  requires_capture: "authorized",
  succeeded: "paid",
  canceled: "canceled",
};

export function fromPaymentIntent(intent: StripePaymentIntent): Payment {
  const customer = intent.customer;
  return {
    id: intent.id,
    amount: intent.amount,
    currency: intent.currency.toUpperCase(),
    status: STATUS[intent.status],
    customerId: typeof customer === "string" ? customer : (customer?.id ?? null),
    createdAt: new Date(intent.created * 1000).toISOString(),
  };
}
