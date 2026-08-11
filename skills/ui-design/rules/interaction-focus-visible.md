---
title: Preserve Visible Focus States
id: interaction-focus-visible
category: interaction
defaultTier: release-blocker
detect: static
---

## Preserve Visible Focus States

Never remove outlines without a clear `:focus-visible` replacement. With the outline gone, keyboard users cannot see where they are and the interface stops being navigable.

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
