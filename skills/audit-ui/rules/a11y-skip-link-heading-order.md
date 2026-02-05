---
title: Provide Skip Link and Logical Heading Order
impact: HIGH
impactDescription: improves keyboard and screen reader navigation
tags: accessibility, headings, skip-link
---

## Provide Skip Link and Logical Heading Order

Include a skip link and keep heading levels sequential.

**Incorrect (no skip link, jumps heading levels):**

```tsx
<main>
  <h1>Dashboard</h1>
  <h4>Recent activity</h4>
</main>
```

**Correct (skip link + ordered headings):**

```tsx
<a className="skip-link" href="#main-content">Skip to content</a>
<main id="main-content">
  <h1>Dashboard</h1>
  <h2>Recent activity</h2>
</main>
```
