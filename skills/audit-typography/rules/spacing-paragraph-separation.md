---
title: Use Line Breaks or Indents, Not Both
impact: HIGH
tags: paragraphs, line-breaks, indents, separation
---

## Use Line Breaks or Indents, Not Both

Separate paragraphs with either vertical space (line breaks) or indentation \u2014 never both. Line breaks are the web default and aid scanning. Indents feel more formal and classical, making longform content flow more smoothly. An indent after a line break is redundant.

**Incorrect (both indent and space):**

```css
p {
  text-indent: 1.5em;
  margin-bottom: 1.5em; /* double separation */
}
```

**Correct (line breaks only, the web default):**

```css
p {
  margin-bottom: 1em;
  text-indent: 0;
}
```

**Or indents only (longform/editorial):**

```css
p {
  margin-bottom: 0;
  text-indent: 1.5em;
}

p:first-of-type {
  text-indent: 0; /* no indent on first paragraph */
}
```
