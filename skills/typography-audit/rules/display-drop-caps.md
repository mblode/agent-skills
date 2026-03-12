---
title: Implement Drop Caps or Initial Caps
impact: LOW-MEDIUM
tags: drop-cap, initial-letter, initial-cap, editorial
---

## Implement Drop Caps or Initial Caps

Drop caps (large initial letter spanning multiple lines) and raised initial caps (large first letter on the baseline) add editorial polish. Use CSS `initial-letter` (supported in Safari and Chrome) or a JS fallback.

Small caps after the drop cap create an elegant transition to body text.

**CSS drop cap:**

```css
.article > p:first-of-type::first-letter {
  initial-letter: 3; /* spans 3 lines */
  font-weight: 700;
  margin-right: 0.1em;
  color: var(--accent);
}
```

**Fallback with float (broader support):**

```css
.article > p:first-of-type::first-letter {
  float: left;
  font-size: 3.5em;
  line-height: 0.8;
  padding-right: 0.1em;
  font-weight: 700;
  color: var(--accent);
}
```

Keep drop caps simple. Overly decorative drop caps work in print but can look heavy on screen. Use them at the start of articles or major sections, not on every paragraph.
