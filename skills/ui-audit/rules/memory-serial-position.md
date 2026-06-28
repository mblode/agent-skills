---
title: Serial Position Effect
impact: MEDIUM-HIGH
kind: programmatic
prefix: memory
tags: memory, navigation, primacy, recency, ordering
related: memory-peak-end-rule, perception-von-restorff, cognitive-millers-law
---

## Serial Position Effect

Items at the start of a sequence (primacy) and at the end (recency) are recalled more reliably than items in the middle. The middle of any list, menu, or nav bar is the forgotten zone. Place the most consequential actions on the edges and demote low-priority items into the middle. Source: Ebbinghaus (1885); Murdock (1962).

The effect weakens once a list exceeds working-memory chunks (≈7), so combine with chunking and clear grouping for long lists. Primacy aids deliberate recall (users return looking for it); recency aids immediate recall (users just saw it).

## Check

**Surfaces:** primary-nav, list, search-results

**Procedure:**
1. Find ordered sets: `<nav>`, `<ul>`/`<ol>` of links, menu items, search-result rows.
2. Identify the primary action(s) in each set (sign up, checkout, sign in, primary CTA, most-relevant result).
3. Check whether the primary action sits at the **start** or **end** of the sequence; record its index.

**Concrete commands:**
```bash
rg -n '<nav|<ul|<ol|role="menu"' src/
# Then Read each match and inspect the order of children.
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | Primary action at index 0 OR last index of the sequence |: |
| warn | Primary action at index 1 OR second-to-last (one position from edge) | MEDIUM |
| fail | Primary action in the middle of a sequence with ≥5 items | HIGH |

## Fix

**If fail:** Move the primary action to index 0 or last index. For navs with logo + actions, place primary CTA at the trailing edge of the action group (typically `Sign up` rightmost on LTR layouts).

**If warn:** Promote the primary action one slot to the edge, or demote the item currently at the edge if it's lower-priority.

## Examples

**Anti-pattern (fails):**

```html
<nav class="flex gap-6">
  <a href="/products">Products</a>
  <a href="/pricing">Pricing</a>
  <a href="/sign-in">Sign in</a>
  <a href="/blog">Blog</a>
  <a href="/about">About</a>
  <a href="/changelog">Changelog</a>
  <a href="/careers">Careers</a>
</nav>
```

**Applied (passes):**

```html
<nav class="flex items-center justify-between">
  <a href="/" class="font-semibold">Acme</a>
  <ul class="flex gap-6">
    <li><a href="/products">Products</a></li>
    <li><a href="/pricing">Pricing</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><a href="/about">About</a></li>
  </ul>
  <div class="flex gap-3">
    <a href="/sign-in">Sign in</a>
    <a href="/sign-up" class="rounded bg-black px-3 py-1.5 text-white">Get started</a>
  </div>
</nav>
```

Reference: https://lawsofux.com/serial-position-effect/
