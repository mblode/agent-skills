---
title: Preserve Visible Focus States
impact: CRITICAL
impactDescription: critical for keyboard operability
tags: interaction, focus, keyboard
---

## Preserve Visible Focus States

Never remove outlines without a clear `:focus-visible` replacement.

**Incorrect (focus removed):**

```css
button:focus {
  outline: none;
}
```

**Correct (high-contrast focus ring):**

```css
button:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```
