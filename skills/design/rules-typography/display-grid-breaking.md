---
title: Break the Grid Intentionally
impact: LOW-MEDIUM
tags: grid, layout, oversized, pull-quotes, editorial
---

## Break the Grid Intentionally

Oversized type, full-bleed images, and pull quotes that extend past the text column break monotony. Break the grid as a deliberate choice, keeping the underlying structure intact.

**Incorrect (accidental grid break, sloppy layout):**

```css
blockquote {
  width: 120%; /* overflows container randomly */
}
```

**Correct (intentional grid break with structure):**

```css
.article {
  max-width: 65ch;
  margin: 0 auto;
}

/* Pull quote breaks the grid intentionally */
.pull-quote {
  max-width: 85ch;
  margin: 3rem -5rem;
  padding: 2rem;
  font-size: 1.5em;
  line-height: 1.35;
  font-style: italic;
  border-left: 3px solid var(--accent);
}

/* Full-bleed image breaks the grid */
.full-bleed {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

@media (max-width: 768px) {
  .pull-quote {
    margin: 2rem 0;
  }
}
```

Allow grid deviations only when they serve the content. Use whitespace as a design element.
