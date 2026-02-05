---
title: Keep Line Length Between 45\u201375 Characters
impact: HIGH
tags: measure, line-length, characters-per-line, readability
---

## Keep Line Length Between 45\u201375 Characters

The ideal line length (measure) is approximately 66 characters per line including spaces. Lines shorter than 45 characters create excessive hyphenation or ragged edges. Lines longer than 75 characters cause readers to lose their place when moving to the next line.

Adjust line length per breakpoint. Use `ch` units or `max-width` on text containers.

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

The `ch` unit equals the width of the "0" character. It approximates character count but varies by typeface. Test with actual content to verify.
