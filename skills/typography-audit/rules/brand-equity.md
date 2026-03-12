---
title: Protect Brand Typographic Equity
impact: LOW-MEDIUM
tags: brand, consistency, equity, identity
---

## Protect Brand Typographic Equity

Once you establish core type choices, stick with them. Frequent changes erode brand recognition. Document your typographic system (typefaces, sizes, weights, colors, spacing) and require adherence across all touchpoints.

Add at least one distinctive typographic move per project \u2014 but make it a deliberate part of the system, not a one-off deviation.

**Guidelines:**

- Document type choices in a brand/design system
- Create CSS custom properties or design tokens for all type styles
- Review new designs for adherence to the type system
- Allow evolution but require justification for changes
- Keep reference links to foundry pages and license documentation

```css
/* Document the system in code */
:root {
  /* Primary typeface: Inter (licensed for web) */
  --font-primary: 'Inter', -apple-system, sans-serif;

  /* Heading typeface: Fraunces (Google Fonts, SIL OFL) */
  --font-heading: 'Fraunces', Georgia, serif;

  /* Monospace: JetBrains Mono */
  --font-mono: 'JetBrains Mono', monospace;
}
```
