---
title: Use Color Intentionally in Typography
impact: LOW-MEDIUM
tags: color, contrast, tinted-black, brand, accessibility
---

## Use Color Intentionally in Typography

Use color to create hierarchy and reinforce brand identity. Ensure sufficient contrast between text and background (WCAG AA minimum). Avoid pure black (#000) on pure white (#fff) \u2014 the extreme contrast causes eye strain. Use slightly tinted blacks and off-whites for a more refined, readable experience.

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

Subtle color tints (warm, cool, brand-hued) create distinctive atmosphere without sacrificing readability. Keep contrast ratios above 4.5:1 for body text and 3:1 for large text.
