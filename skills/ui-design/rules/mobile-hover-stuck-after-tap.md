---
title: Hover styles stick after tap
id: mobile-hover-stuck-after-tap
category: mobile
defaultTier: fix-this-sprint
detect: static
related: mobile-hover-only-affordance
---

## Hover styles stick after tap

A tap on iOS matches `:hover` and leaves it on. The card stays scaled, the row stays highlighted, and the next tap hits the stuck state. Cosmetic hover (background, shadow, scale) belongs in `@media (hover: hover) and (pointer: fine)`.

Actions that *appear* only on hover are `mobile-hover-only-affordance`: they need a visible touch control, not just this media query.

## Detection

Search for unguarded hover styling. A hit is confirmed when the hover changes paint or transform and is not inside `(hover: hover) and (pointer: fine)`.

```bash
rg -nP ':hover|hover:(bg-|scale-|shadow-|opacity-|ring-)' -g '*.css' -g '*.tsx' -g '*.jsx' src/
```

`hover:opacity-100` paired with a hidden rest state is the other rule. Skip files that already wrap hover in `@media (hover: hover) and (pointer: fine)`, `hoverOnlyWhenSupported`, or a `fine-hover` variant.

**Incorrect (hover sticks after tap):**

```css
.card:hover {
  background: var(--hover-bg);
}
```

**Correct (hover only on a fine pointer):**

```css
@media (hover: hover) and (pointer: fine) {
  .card:hover {
    background: var(--hover-bg);
  }
}
```
