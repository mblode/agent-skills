---
title: Avoid Justified Text on the Web
impact: MEDIUM
tags: text-align, justified, hyphenation, rivers
---

## Avoid Justified Text on the Web

Justified text creates rivers of whitespace and uneven word spacing on the web, where hyphenation support is inconsistent. Only justify text when paired with strong hyphenation (`hyphens: auto`) and a sufficiently long line length. Never justify narrow columns.

Never use letterspacing to fill justified lines \u2014 it produces grotesque spacing.

**Incorrect (justified without hyphenation):**

```css
.article {
  text-align: justify;
  /* no hyphenation \u2014 creates rivers and stretched words */
}
```

**Correct (left-aligned, or justified with hyphenation):**

```css
/* Preferred: left-aligned */
.article {
  text-align: left;
}

/* If justified, require hyphenation and adequate measure */
.article-justified {
  text-align: justify;
  hyphens: auto;
  -webkit-hyphens: auto;
  max-width: 65ch; /* ensure long lines for justification to work */
}
```

Browser hyphenation depends on language dictionaries. Set `lang` on the `<html>` element and test thoroughly.
