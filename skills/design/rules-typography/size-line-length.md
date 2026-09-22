---
title: Keep Line Length Between 45 and 75 Characters
impact: HIGH
tags: measure, line-length, characters-per-line, readability
---

## Keep Line Length Between 45 and 75 Characters

Ideal measure is about 66 characters per line including spaces. Under 45 forces excessive hyphenation or ragged edges; over 75 makes readers lose their place on line return. Constrain measure per breakpoint with `ch` units or `max-width` on text containers.

**Incorrect (no measure constraint):**

```css
.article {
  width: 100%; /* lines can stretch to 120+ characters on wide screens */
  font-size: 18px;
}
```

**Correct (constrained measure):**

```css
.article {
  max-width: 65ch; /* approximately 65 characters */
  font-size: 18px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .article {
    max-width: 100%;
    padding: 0 1rem;
    /* Narrower screen naturally constrains measure */
  }
}
```

`ch` equals the width of the "0" glyph: it approximates character count but varies by typeface, so test with real content.
