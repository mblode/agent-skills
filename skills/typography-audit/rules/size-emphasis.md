---
title: Emphasize with Italics, Never Underlines or Caps
impact: HIGH
tags: emphasis, italic, underline, links, all-caps
---

## Emphasize with Italics, Never Underlines or Caps

Use italics for emphasis in running text: they emphasize without disrupting reading flow. Reserve bold for strong semantic importance. All caps reduces reading speed and reads as shouting. Never underline for emphasis; on the web an underline universally signals a hyperlink, so it creates a false affordance and readers click text that does nothing. In print it is a typewriter-era substitute for italics with no place in modern typography.

Limit how much text is emphasized: if everything is emphasized, nothing is. Prefer body fonts with a real italic.

**Incorrect (bold, caps, and underline for emphasis):**

```html
<p>Typography is <b>REALLY</b> important for readability.</p>
<p>This is an <span class="important">important</span> point.</p>
```

```css
.important {
  text-decoration: underline; /* looks like a link */
}
```

**Correct (italics for emphasis, underlines reserved for links):**

```html
<p>Typography is <em>really</em> important for readability.</p>
<p>Italicize publication titles: <cite>The Elements of Typographic Style</cite>.</p>
<p>Read more on <a href="/typography">our typography page</a>.</p>
```

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

Use `<em>` for emphasis and `<cite>` for publication titles; reserve `<i>` for an alternate voice (technical terms, foreign phrases). The same false affordance applies to color: never give non-link text your link color, which is the most common way headings get mistaken for links.
