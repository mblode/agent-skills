---
title: Format Lists with Proper Markup and Spacing
impact: MEDIUM
tags: lists, ul, ol, vertical-spacing, wrapping
---

## Format Lists with Proper Markup and Spacing

Use semantic `<ul>` or `<ol>` elements for lists. Ensure list text does not wrap under the bullet \u2014 use proper list styling. Add vertical spacing between multi-line items so wrapped lines stay visually grouped with their bullet.

**Incorrect (fake lists, text wraps under bullet):**

```html
<p>- First item that is long enough to wrap onto a second line which
goes under the bullet</p>
<p>- Second item</p>
```

**Correct (proper markup, indented text):**

```html
<ul>
  <li>First item that is long enough to wrap onto a second line, which
  stays indented from the bullet.</li>
  <li>Second item</li>
</ul>
```

```css
ul {
  padding-left: 1.5em;
  list-style-position: outside; /* prevents wrap under bullet */
}

li {
  margin-bottom: 0.5em; /* space between items */
}

/* For items with titles or multi-line content */
li + li {
  margin-top: 0.75em;
}
```

Test lists with long content at narrow viewport widths. If list item titles wrap, increase vertical padding and tighten line height so wrapped lines stay grouped.
