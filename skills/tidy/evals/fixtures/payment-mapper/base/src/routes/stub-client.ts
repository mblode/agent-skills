import type { StripeClient, StripePaymentIntent } from "../payments/types.ts";

export function clientWith(intents: StripePaymentIntent[]): StripeClient {
  return {
    async retrievePaymentIntent(id) {
      const intent = intents.find((candidate) => candidate.id === id);
      if (!intent) throw new Error(`No such payment_intent: ${id}`);
      return intent;
    },
    async listPaymentIntents(customerId) {
      return intents.filter((intent) => {
        const customer = intent.customer;
        return (typeof customer === "string" ? customer : customer?.id) === customerId;
      });
    },
  };
}
