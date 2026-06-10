---
title: Implement Drop Caps or Initial Caps
impact: LOW-MEDIUM
tags: drop-cap, initial-letter, initial-cap, editorial
---

## Implement Drop Caps or Initial Caps

Drop caps (large initial letter spanning multiple lines) add editorial polish at the start of articles or major sections. Use CSS `initial-letter` where supported, with a float fallback, not a bare `font-size` bump, which breaks line alignment.

**Incorrect (oversized first letter with no drop-cap handling):**

```css
.article > p:first-of-type::first-letter {
  font-size: 3.5em;
  /* No initial-letter or float, so the huge glyph sits on the first
     baseline and shoves line 1 away from the rest of the paragraph */
}
```

**Correct (initial-letter with float fallback):**

```css
.article > p:first-of-type::first-letter {
  initial-letter: 3; /* spans 3 lines */
  font-weight: 700;
  margin-right: 0.1em;
  color: var(--accent);
}

@supports not (initial-letter: 3) {
  .article > p:first-of-type::first-letter {
    float: left;
    font-size: 3.5em;
    line-height: 0.8;
    padding-right: 0.1em;
  }
}
```

Keep drop caps simple; overly decorative versions work in print but look heavy on screen. Use them at the start of articles or major sections, never on every paragraph. Small caps after the drop cap create an elegant transition to body text.
