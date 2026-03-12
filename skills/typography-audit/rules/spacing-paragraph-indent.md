---
title: Apply Indents Correctly
impact: HIGH
tags: text-indent, paragraphs, first-paragraph, sizing
---

## Apply Indents Correctly

When using indentation for paragraph separation, apply the indent only after the first paragraph \u2014 the opening paragraph needs no indent since there is nothing to separate it from. Size indents to approximately 1\u20131.5em; larger indents (2\u20133em) suit wide columns with ample margins.

**Incorrect (every paragraph indented, including first):**

```css
p {
  text-indent: 1.5em;
}
```

**Correct (indent only after first paragraph):**

```css
p + p {
  text-indent: 1.5em;
}
```

For narrow columns, use a smaller indent. Indents larger than 3em are generally counterproductive.
