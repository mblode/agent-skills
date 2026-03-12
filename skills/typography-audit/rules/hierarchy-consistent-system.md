---
title: Define and Document a Type System
impact: MEDIUM-HIGH
tags: type-system, consistency, design-tokens, documentation
---

## Define and Document a Type System

Define a consistent set of type styles (sizes, weights, line-heights, colors) and apply them uniformly. Avoid random one-off style changes. Document the system so all contributors follow the same conventions. Use CSS custom properties or design tokens to enforce consistency.

**Incorrect (ad hoc styling throughout):**

```css
.page-a h2 { font-size: 28px; font-weight: 700; }
.page-b h2 { font-size: 24px; font-weight: 600; }  /* different from page-a */
.page-c h2 { font-size: 30px; font-weight: 800; }  /* different again */
```

**Correct (systematic type scale):**

```css
:root {
  --font-body: 'Inter', sans-serif;
  --font-heading: 'Inter', sans-serif;

  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;
  --text-3xl: 2.5rem;

  --leading-tight: 1.2;
  --leading-normal: 1.5;
}

h2 {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  line-height: var(--leading-tight);
  font-weight: 700;
}
```

Do not obsess over baseline grids on the web. Prioritize consistent font size, line height, and line length over pixel-perfect vertical alignment. Accept web fluidity.
