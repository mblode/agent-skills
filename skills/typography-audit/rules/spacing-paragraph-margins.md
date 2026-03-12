---
title: Add Adequate Margins Around Text
impact: HIGH
tags: margins, padding, gutters, mobile, breathing-room
---

## Add Adequate Margins Around Text

Ensure adequate padding and margins around text blocks, including column padding, outer margins, thumb space on mobile, and print gutters. Keep paragraph spacing modest and responsive \u2014 avoid paragraphs that touch each other or have excessive gaps.

Set line height first, then adjust paragraph spacing. The two values work together.

**Incorrect (cramped margins):**

```css
.article {
  padding: 0;
  margin: 0;
}

p {
  margin: 0; /* paragraphs run together */
}
```

**Correct (generous, responsive margins):**

```css
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
    padding: 1rem; /* adequate thumb space */
  }
}
```

Break long copy into readable paragraphs. Avoid walls of text. Use subheadings and lists where useful.
