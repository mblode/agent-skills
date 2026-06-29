---
title: Protect Brand Typographic Equity
impact: LOW-MEDIUM
tags: brand, consistency, equity, identity
---

## Protect Brand Typographic Equity

Once core type choices are set, stick with them; frequent changes erode recognition. Document the system (typefaces, sizes, weights, colors, spacing) as design tokens or CSS custom properties and require adherence across all touchpoints.

**Incorrect (ad-hoc fonts per surface, nothing documented):**

```css
/* landing.css */
h1 { font-family: 'Fraunces', serif; }

/* dashboard.css: someone picked a different heading face */
h1 { font-family: 'Playfair Display', serif; }

/* email.css: a third variant, hardcoded */
h1 { font-family: Georgia, serif; }
```

**Correct (system documented in tokens, used everywhere):**

```css
:root {
  /* Primary typeface: Inter (licensed for web) */
  --font-primary: 'Inter', -apple-system, sans-serif;

  /* Heading typeface: Fraunces (Google Fonts, SIL OFL) */
  --font-heading: 'Fraunces', Georgia, serif;

  /* Monospace: JetBrains Mono */
  --font-mono: 'JetBrains Mono', monospace;
}

h1 { font-family: var(--font-heading); }
```

Allow evolution but require justification. Add at least one distinctive typographic move per project as a deliberate part of the system, not a one-off. Keep links to foundry pages and license docs.
