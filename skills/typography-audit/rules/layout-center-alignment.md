---
title: Center-Align Text Sparingly
impact: MEDIUM
tags: text-align, center, alignment, readability
---

## Center-Align Text Sparingly

Center-aligned text disrupts the left reading edge that anchors the reader's eye. Use it only for intentional formal or display contexts: invitations, short hero text, or single-line captions. Never center-align more than a few lines.

When centering text, increase line height slightly to compensate for the ragged edges on both sides.

**Incorrect (centered body paragraphs):**

```css
.article p {
  text-align: center; /* hard to read at paragraph length */
}
```

**Correct (centered for display only, left for prose):**

```css
.article p {
  text-align: left;
}

.hero-tagline {
  text-align: center;
  line-height: 1.6; /* slightly more than normal */
  max-width: 40ch;  /* keep lines short */
  margin: 0 auto;
}
```

Avoid default `text-align: center` on containers that may hold paragraph-length text.
