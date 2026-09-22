---
title: Provide Skip Link and Logical Heading Order
id: a11y-skip-link-heading-order
category: a11y
defaultTier: fix-this-sprint
detect: static
---

## Provide Skip Link and Logical Heading Order

Include a skip link and keep heading levels sequential. Without both, keyboard and screen reader users walk the whole header on every page and lose the outline they navigate by.

## Detection

Find files that render `<main>` with no in-page anchor above it; a hit is confirmed when no layout wrapping that file provides one either.

```bash
rg -lP '<main\b' -g '*.tsx' -g '*.jsx' src/ | xargs -r rg --files-without-match -P 'href="#'
```

The skip link usually lives in the root layout rather than the file rendering `<main>`, so every page component matches until you check the layout above it. Heading order is not in this recipe on purpose: a component that starts at `<h2>` is correct when the page supplies the `<h1>`, so read the composed page outline for that half.

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
