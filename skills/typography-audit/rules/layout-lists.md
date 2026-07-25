---
title: Format Lists with Proper Markup and Spacing
impact: MEDIUM
tags: lists, ul, ol, bullets, hanging, vertical-spacing
---

## Format Lists with Proper Markup and Spacing

Use semantic `<ul>` or `<ol>` elements, never paragraphs with typed dashes. Keep `list-style-position: outside`: `inside` wraps continuation lines under the bullet and destroys the left text edge. Add vertical spacing between items so a wrapped line stays visually grouped with its own bullet.

**Incorrect (fake list, inside positioning):**

```html
<p>- First item that is long enough to wrap onto a second line which
goes under the bullet</p>
<p>- Second item</p>
```

```css
ul {
  list-style-position: inside; /* wrapped lines sit under the bullet */
}
```

**Correct (semantic markup, outside positioning, spaced items):**

```html
<ul>
  <li>First item that is long enough to wrap onto a second line, which
  stays indented from the bullet.</li>
  <li>Second item</li>
</ul>
```

```css
/* Indented bullets: text indented from the left edge (safer web default) */
ul {
  list-style-position: outside;
  padding-left: 1.5em;
}

li {
  margin-bottom: 0.5em;
}

/* Hanging bullets: bullets sit in the margin, print-like */
ul.hanging {
  list-style-position: outside;
  padding-left: 0;
  margin-left: 1em;
}
```

Prefer indented bullets on the web and avoid hanging bullets on mobile, where the margin space they need does not exist. Test long content at narrow viewports: if item titles wrap, increase vertical spacing between items and tighten line height so wrapped lines stay grouped.
