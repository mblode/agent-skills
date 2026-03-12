---
title: Use Letterspaced Caps for Subheadings
impact: MEDIUM-HIGH
tags: subheadings, uppercase, small-caps, letterspacing, hierarchy
---

## Use Letterspaced Caps for Subheadings

Letterspaced uppercase or small caps work well for subheadings and labels. Size caps down slightly to avoid shouting \u2014 uppercase at the same size as body text feels too loud. Small caps with slight tracking create an elegant secondary heading level.

**Incorrect (full-size uppercase, no spacing):**

```css
.subhead {
  text-transform: uppercase;
  font-size: 18px;  /* same as body, feels aggressive */
}
```

**Correct (sized down, tracked uppercase):**

```css
.subhead {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Or small caps variant */
.subhead-sc {
  font-variant-caps: all-small-caps;
  letter-spacing: 0.05em;
  font-size: 1rem;
}
```
