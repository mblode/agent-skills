---
title: Handle Long and Unbroken Content Safely
id: layout-long-content-safety
category: layout
defaultTier: fix-this-sprint
detect: rendered
---

## Handle Long and Unbroken Content Safely

Protect UI against long names, URLs, and dense content blocks. Unhandled, a single long token overflows its container and breaks the layout around it.

## Detection

No grep decides this. Whether a container overflows depends on its rendered width and the content it actually receives, and the failing shape (a `truncate` child inside a flex parent missing `min-width: 0`) is a relationship between elements that no single-file pattern can confirm.

Evidence to collect: render the surface at 320px and at the narrowest supported desktop width, seeded with a hostile fixture (a 60-character unbroken token, a 200-character name, a raw URL with no spaces, a locale whose strings run 30% longer). Then, per candidate container, compare `scrollWidth` against `clientWidth` and screenshot anything where the content escapes its box or pushes a sibling off screen. Report the overflowing element with its viewport width and the string that broke it.

**Incorrect (overflow risk):**

```css
.card-title {
  white-space: nowrap;
}
```

**Correct (safe truncation/wrapping):**

```css
.card {
  min-width: 0;
}
.card-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-body {
  overflow-wrap: anywhere;
}
```
