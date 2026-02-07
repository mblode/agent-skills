---
title: Use realistic names in examples, never foo/bar/x/data
impact: HIGH
tags: examples, naming, placeholders
---

## Use realistic names in examples, never foo/bar/x/data

Placeholder names force readers to mentally substitute real values. Use names that reflect the actual domain: `userId`, `orderTotal`, `configPath`.

**Incorrect (abstract placeholders add cognitive load):**

```javascript
const x = getData(foo);
const result = process(x, bar);
```

**Correct (domain names make the example self-documenting):**

```javascript
const response = fetchUserProfile(userId);
const invoice = generateInvoice(response, billingPlan);
```

See also: `code-descriptive-variables.md` for code-specific naming in standalone examples.

Reference: [Google Technical Writing — Clear sentences](https://developers.google.com/tech-writing/one/clear-sentences)
