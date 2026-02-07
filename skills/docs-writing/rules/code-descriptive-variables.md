---
title: Use descriptive variable names in examples
impact: HIGH
tags: variables, naming, readability
---

## Use descriptive variable names in examples

Variable names teach readers what the code does. Use `subscriptionId`, `paymentIntent`, `customerEmail` -- never `x`, `y`, `data`, `temp`, `result`.

**Incorrect (generic names force readers to track mental mappings):**

```javascript
const d = await get(id);
const r = transform(d, opts);
console.log(r.status);
```

**Correct (descriptive names make the code self-documenting):**

```javascript
const invoice = await getInvoice(invoiceId);
const receipt = formatReceipt(invoice, displayOptions);
console.log(receipt.status);
```

See also: `clarity-meaningful-names.md` for naming in prose examples and explanatory text.

Reference: [Google Technical Writing — Naming variables](https://developers.google.com/tech-writing/one/clear-sentences)
