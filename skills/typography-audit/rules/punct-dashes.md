---
title: Em Dash vs En Dash vs Hyphen
impact: CRITICAL
tags: dashes, em-dash, en-dash, hyphen, punctuation
---

## Em Dash vs En Dash vs Hyphen

Each dash serves a distinct purpose. Never use double hyphens (`--`) as a substitute for an em dash. Choose either spaced en dashes or unspaced em dashes for parenthetical breaks and apply the choice consistently throughout the project.

If the em dash looks too wide in your chosen typeface, switch to spaced en dashes.

**Incorrect (double hyphens and wrong dash types):**

```html
<p>Typography--the art of type--matters.</p>
<p>Pages 10-20 cover the basics.</p>
<p>The New York-London flight departs at noon.</p>
```

**Correct (proper dash characters):**

```html
<!-- Em dash for breaks (unspaced style) -->
<p>Typography&mdash;the art of type&mdash;matters.</p>

<!-- Or en dash for breaks (spaced style) -->
<p>Typography &ndash; the art of type &ndash; matters.</p>

<!-- En dash for ranges -->
<p>Pages 10&ndash;20 cover the basics.</p>

<!-- En dash for relationships/connections -->
<p>The New York&ndash;London flight departs at noon.</p>
```

**Key characters:**

| Character | Name | HTML Entity | Use |
|-----------|------|-------------|-----|
| \u2014 | Em dash | `&mdash;` | Parenthetical breaks, attribution |
| \u2013 | En dash | `&ndash;` | Ranges, relationships |
| - | Hyphen | `-` | Compound words only |

Use em dash for attribution in blockquotes: `&mdash;Robert Bringhurst`
