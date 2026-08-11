---
title: Distinguish Links Without Layout Shift
id: type-link-distinction-no-shift
category: type
defaultTier: backlog
detect: rendered
---

## Distinguish Links Without Layout Shift

Keep links visually distinct, but hover must not change text metrics.

## Detection

Search for hover rules that change a text metric rather than colour or decoration.

```bash
rg -nUP ':hover\s*\{[^}]*(?:font-weight|font-size|letter-spacing|border-width)|hover:(?:font-(?:bold|semibold|medium|light)|tracking-|text-(?:xs|sm|base|lg|[2-9]?xl))' -g '*.css' -g '*.tsx' -g '*.jsx' src/
```

A weight change on an element already reserved at its bold width (a nav item with a fixed width, or the `data-text` bold-ghost trick) matches but does not shift. Confirm by hovering the rendered link and watching whether neighbouring text moves.

**Incorrect (hover changes weight and shifts layout):**

```css
a {
  text-decoration: none;
}
a:hover {
  font-weight: 700;
}
```

**Correct (stable hover treatment):**

```css
a {
  text-decoration: underline;
  text-underline-offset: 0.12em;
}
a:hover {
  color: var(--link-hover);
}
```
