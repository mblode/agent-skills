---
title: Add Adequate Margins, Gutters, and Padding Around Text
impact: HIGH
tags: margins, padding, gutters, columns, mobile
---

## Add Adequate Margins, Gutters, and Padding Around Text

Text needs breathing room on every edge: column gutters wide enough that adjacent columns do not read as one, container padding that keeps text off the screen edges, thumb space on mobile, and print gutters. Text touching a phone's bezel is one of the most common and most obvious layout defects. Keep paragraph spacing modest and responsive; paragraphs should neither run together nor float apart.

**Incorrect (no gutters, text hits the screen edge, paragraphs run together):**

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0; /* columns touch */
}

.article {
  padding: 0; /* text hits screen edges on mobile */
}

p {
  margin: 0; /* paragraphs run together */
}
```

**Correct (gutters, container padding, responsive paragraph spacing):**

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem; /* comfortable gutter between columns */
}

.article {
  padding: 2rem;
  max-width: 65ch;
  margin: 0 auto;
}

p {
  margin-bottom: 1em;
}

@media (max-width: 768px) {
  .article {
    padding: 1rem; /* minimum thumb space */
  }

  .grid {
    grid-template-columns: 1fr; /* stack rather than shrink the measure */
  }
}
```

Set line height before paragraph spacing; the two values work together to make vertical rhythm. Break long copy into readable paragraphs with subheadings and lists rather than shipping a wall of text.
