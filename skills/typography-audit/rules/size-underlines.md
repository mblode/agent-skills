---
title: Never Underline for Emphasis
impact: HIGH
tags: underline, links, emphasis, readability
---

## Never Underline for Emphasis

On the web, underlines universally signal hyperlinks; using them for emphasis confuses users and creates false affordances. In print, they are a typewriter-era convention with no place in modern typography.

**Incorrect (underline for emphasis):**

```css
.important {
  text-decoration: underline; /* looks like a link */
}
```

```html
<p>This is an <span class="important">important</span> point.</p>
```

**Correct (italics for emphasis, underlines for links):**

```css
a {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.15em;
}

em {
  font-style: italic;
}
```

```html
<p>This is an <em>important</em> point.</p>
<p>Read more on <a href="/typography">our typography page</a>.</p>
```

Avoid link color (typically blue) on non-link text; it creates the same confusion.
