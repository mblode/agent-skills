---
title: Rule Title Here
impact: MEDIUM
impactDescription: Optional one-line consequence (e.g., "saves hours of per-error debugging")
tags: tag1, tag2
---

## Rule Title Here

**Impact: MEDIUM (optional consequence note)**

One or two sentences on why the rule matters; name the developer-facing failure, not just the best practice. Set `impact` higher than the category default only when the failure mode justifies it.

**Incorrect (what is wrong and why):**

```ts
// Minimal failing example: only the lines that violate the rule
```

**Correct (what the fix looks like):**

```ts
// Same example, fixed; diff against the incorrect block should be obvious
```
