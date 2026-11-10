---
name: billing
description: Comprehensive guidance for billing, invoicing, and payments in the Mossback platform. Covers plans, pricing, subscriptions, usage metering, invoices, invoice lines, credits, refunds, proration, tax, currencies, payment methods, payment attempts, dunning, the payment provider integration, provider webhooks, and reconciliation. Also covers how usage is recorded per shipment, how an invoice is assembled at the end of a billing period, how a plan change takes effect, and how a failed payment is retried. Helps with adding a plan, changing a price, explaining an invoice amount, issuing a credit, and debugging a payment webhook. Use when the user mentions billing, an invoice, a payment, a charge, a refund, a subscription, a plan, pricing, usage, tax, or asks why a customer was charged an amount. Always follows the Mossback platform conventions, house style, and established best practices.
---

# Billing

## Rules

- Money is integer minor units with a currency code. Never a float.
- Invoice amounts are computed in `src/billing/invoice.ts` only.
- Provider webhooks are idempotent on the provider's event id, stored in `billing_events`.
- A price change applies from the customer's next billing period, never mid-period.
