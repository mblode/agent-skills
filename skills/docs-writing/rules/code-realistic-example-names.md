---
title: Name example values after the product's domain, never foo/bar/x/data
impact: HIGH
tags: examples, naming, placeholders
---

## Name example values after the product's domain, never foo/bar/x/data

An example is reference material, not a syntax demo: readers copy it and adapt it. Placeholder names (`foo`, `bar`, `x`, `data`, `temp`, `result`) force a mental substitution before that adaptation can start, and they hide which argument is an ID, an object, or a config path. Use names from the product's own domain: `subscriptionId`, `paymentIntent`, `orderTotal`, `configPath`.

**Incorrect (placeholders hide what each value is):**

```javascript
const x = await get(foo);
const result = transform(x, bar);
console.log(result.status);
```

**Correct (domain names make the example self-documenting):**

```javascript
const invoice = await getInvoice(invoiceId);
const receipt = formatReceipt(invoice, displayOptions);
console.log(receipt.status);
```

Reference: [Google developer documentation style guide: Code samples](https://developers.google.com/style/code-samples)
