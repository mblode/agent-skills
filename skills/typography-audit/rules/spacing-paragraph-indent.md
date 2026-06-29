---
title: Apply Indents Correctly
impact: HIGH
tags: text-indent, paragraphs, first-paragraph, sizing
---

## Apply Indents Correctly

When using indentation for paragraph separation, indent only paragraphs after the first (the opening paragraph has nothing to separate from). Size indents to 1 to 1.5em; larger indents (2 to 3em) suit wide columns with ample margins.

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

Use smaller indents for narrow columns; above 3em is counterproductive.
