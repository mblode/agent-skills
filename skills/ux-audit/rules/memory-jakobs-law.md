---
title: Jakob's Law
impact: MEDIUM-HIGH
tier: programmatic
prefix: memory
tags: memory, conventions, web-patterns, familiarity, transfer
related: memory-mental-model, decision-paradox-of-the-active-user, cognitive-cognitive-bias
---

## Jakob's Law

Users spend the vast majority of their time on other sites and apps, so they expect your site to behave the way those do. The web has accreted a shared interaction grammar — logo top-left, primary nav center/left, search top-center, cart/account top-right, hamburger top-left or top-right at ≤768 px, footer holds legal and contact. Source: Jakob Nielsen, Nielsen Norman Group.

Honour the grammar and the user's existing knowledge transfers. Deviate and the user pays a learning tax on every visit. Innovate only where the deviation is the product itself, and provide a transition path (preview, opt-in, revert) when you must change a familiar pattern.

## Check

**Surfaces:** primary-nav, marketing-hero, e-commerce

**Procedure:**
1. Identify the seven conventional positions for site chrome: (a) logo top-left, (b) primary nav center or left, (c) search top-center, (d) cart top-right, (e) account top-right, (f) hamburger top-left or top-right at viewports ≤768 px, (g) underlined or visibly distinct links in body copy.
2. Inspect the actual layout — `<header>` order, `flex` justification, `position` classes, breakpoint behavior — and check each convention.
3. Check icon semantics: cart glyph for cart, magnifying glass for search, person/avatar for account. Custom icons (star, heart, asterisk) for these slots fail.

**Concrete commands:**
```bash
rg -n '<header|<nav|aria-label="(Cart|Search|Menu|Account)"' src/
rg -n 'ShoppingCart|Search|Menu|User|Account' src/components
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | ≥6 of 7 conventions honoured | — |
| warn | 4–5 of 7 conventions honoured | MEDIUM |
| fail | <4 of 7 conventions honoured (deeply non-conventional) | HIGH |

## Fix

**If fail:** Restore conventional positions — move logo to top-left, cart to top-right with a `ShoppingCart` glyph, search to top-center with a magnifying glass. Replace custom icons in chrome slots with their universal equivalents.

**If warn:** Fix the 1–3 specific deviations. If a deviation is intentional (e.g. brand-led layout), document it in a code comment and provide an opt-in/revert toggle.

## Examples

**Anti-pattern (fails):**

```html
<header class="flex items-center justify-between p-4">
  <button aria-label="Menu">≡</button>
  <a href="/" class="font-semibold">Acme Shop</a>
  <button aria-label="Cart">★</button>
</header>
```

**Applied (passes):**

```html
<header class="flex items-center gap-4 p-4">
  <a href="/" class="font-semibold">Acme Shop</a>
  <nav class="hidden gap-4 md:flex">
    <a href="/shop">Shop</a>
    <a href="/sale">Sale</a>
    <a href="/about">About</a>
  </nav>
  <form role="search" class="ml-auto flex items-center">
    <label for="q" class="sr-only">Search</label>
    <input id="q" type="search" placeholder="Search products" class="rounded border px-2 py-1" />
  </form>
  <a href="/account" aria-label="Account" class="ml-2"><UserIcon /></a>
  <a href="/cart" aria-label="Cart" class="ml-2 relative">
    <ShoppingCartIcon />
    <span class="absolute -top-1 -right-1 rounded-full bg-black px-1 text-xs text-white">3</span>
  </a>
</header>
```

Reference: https://lawsofux.com/jakobs-law/
