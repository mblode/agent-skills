import { fromPaymentIntent } from "./normalize.ts";
import type { Payment, StripePaymentIntent } from "./types.ts";

export interface PaymentEvent {
  type: "payment_intent.succeeded" | "payment_intent.canceled" | "payment_intent.processing";
  data: { object: StripePaymentIntent };
}

export interface PaymentLedger {
  record(payment: Payment): Promise<void>;
}

export async function handlePaymentEvent(event: PaymentEvent, ledger: PaymentLedger): Promise<void> {
  await ledger.record(fromPaymentIntent(event.data.object));
}
