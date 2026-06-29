---
title: Use Color Intentionally in Typography
impact: LOW-MEDIUM
tags: color, contrast, tinted-black, brand, accessibility
---

## Use Color Intentionally in Typography

Use color for hierarchy and brand identity. Avoid pure black (#000) on pure white (#fff): the extreme contrast strains the eyes. Use tinted blacks and off-whites for a refined, readable result.

**Incorrect (pure black on pure white, no brand color):**

```css
body {
  color: #000000;
  background: #ffffff;
}
```

**Correct (tinted black, brand-informed palette):**

```css
:root {
  --text-primary: #1a1a2e;     /* dark navy, not pure black */
  --text-secondary: #4a4a68;    /* lighter for secondary text */
  --bg-primary: #fafaf8;        /* warm off-white */
  --accent: #2d5f8a;            /* brand blue for links/highlights */
}

body {
  color: var(--text-primary);
  background: var(--bg-primary);
}

a {
  color: var(--accent);
}
```

Subtle tints (warm, cool, brand-hued) add atmosphere without hurting readability. Keep contrast above 4.5:1 for body text, 3:1 for large text (WCAG AA).
