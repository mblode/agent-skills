---
title: Provide Skip Link and Logical Heading Order
id: a11y-skip-link-heading-order
category: a11y
defaultTier: fix-this-sprint
detect: static
---

## Provide Skip Link and Logical Heading Order

Include a skip link and keep heading levels sequential. Without both, keyboard and screen reader users walk the whole header on every page and lose the outline they navigate by.

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
