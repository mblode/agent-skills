export type StripeIntentStatus =
  | "requires_payment_method"
  | "requires_confirmation"
  | "requires_action"
  | "processing"
  | "requires_capture"
  | "succeeded"
  | "canceled";

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: StripeIntentStatus;
  customer: string | { id: string } | null;
  created: number;
  latest_charge: { receipt_url: string | null } | null;
}

export type PaymentStatus = "pending" | "authorized" | "paid" | "canceled";

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  customerId: string | null;
  createdAt: string;
}

export interface StripeClient {
  retrievePaymentIntent(id: string): Promise<StripePaymentIntent>;
  listPaymentIntents(customerId: string): Promise<StripePaymentIntent[]>;
}
