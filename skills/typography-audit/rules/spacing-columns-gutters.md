---
title: Ensure Adequate Column Padding and Gutters
impact: HIGH
tags: columns, gutters, padding, margins, mobile
---

## Ensure Adequate Column Padding and Gutters

Text needs breathing room. Ensure columns have adequate padding between them, outer margins keep text from hitting screen edges, and mobile layouts include thumb space. Cramped text is harder to read and feels unprofessional.

**Incorrect (no gutters, text hits edges):**

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0; /* columns touch */
}

.container {
  padding: 0; /* text hits screen edges on mobile */
}
```

**Correct (proper gutters and margins):**

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem; /* comfortable gutter between columns */
}

.container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem; /* minimum thumb space */
  }

  .grid {
    grid-template-columns: 1fr; /* stack on mobile */
  }
}
```
