---
title: Use explained placeholders and test-mode credentials
impact: HIGH
tags: placeholders, credentials, secrets, copy-paste
---

## Use explained placeholders and test-mode credentials

Readers copy examples verbatim. A value the reader must supply is a placeholder in `UPPER_SNAKE_CASE`, explained once after the block under "Replace the following:". A credential that looks real, especially one with a live prefix such as `sk_live_`, gets pasted into production code and tripped by secret scanners in CI. Sample credentials use the provider's documented test prefix (`sk_test_...`) or a placeholder, never a live-looking string.

**Incorrect (live-looking key, unexplained placeholders):**

````markdown
```bash
curl https://api.acme.com/v1/charges \
  -u sk_live_REDACTED_FULL_LENGTH_LIVE_KEY: \
  -d amount=2000 -d customer=cus_123 -d source=xyz
```
````

**Correct (test key, named placeholders, explained in order):**

````markdown
```bash
curl https://api.acme.com/v1/charges \
  -u sk_test_YOUR_TEST_KEY: \
  -d amount=2000 \
  -d customer=CUSTOMER_ID \
  -d source=PAYMENT_SOURCE_ID
```

Replace the following:

- `CUSTOMER_ID`: the ID of the customer to charge, for example `cus_NffrFeUfNV2Hib`
- `PAYMENT_SOURCE_ID`: the ID of a saved card or bank account on that customer
````

A full-length live-looking sample is not just a reader hazard: GitHub push protection blocks the commit that carries it, including the commit that adds this rule. Write the prefix plus a named placeholder, never a plausible key body.

Reference: [Google developer documentation style guide: Placeholders](https://developers.google.com/style/placeholders), [Stripe: API keys](https://docs.stripe.com/keys)
