---
title: Use Color Intentionally in Typography
impact: HIGH
tags: color, contrast, tinted-black, brand, accessibility
---

## Use Color Intentionally in Typography

Every text color has to clear WCAG AA: 4.5:1 against its background for body text, 3:1 for large text (24px+, or 19px+ bold). That is the floor, not the target, and it applies to secondary text, placeholders, and disabled labels too, which is where brand palettes usually fail. Inside that budget, use color for hierarchy and identity. Avoid pure black (#000) on pure white (#fff): the extreme contrast strains the eyes. Use tinted blacks and off-whites for a refined, readable result.

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

Subtle tints (warm, cool, brand-hued) add atmosphere without hurting readability. Measure the computed pair, not the token name: a `--text-secondary` that reads as "gray" can still land at 3.1:1 on an off-white background.
