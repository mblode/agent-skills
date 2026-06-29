---
title: Use Hair and Thin Spaces for Fine Adjustments
impact: HIGH
tags: hair-space, thin-space, em-dash, citations, spacing
---

## Use Hair and Thin Spaces for Fine Adjustments

When a full word space is too wide but no space is too tight, use hair spaces (`&hairsp;`) or thin spaces (`&thinsp;`): around em dashes, after citations, between nested punctuation, and around special characters.

**Incorrect (no space or full space around em dashes):**

```html
<p>Typography[em dash character]the art of type[em dash character]matters.</p>     <!-- too tight -->
<p>Typography [em dash character] the art of type [em dash character] matters.</p>  <!-- too loose -->
```

**Correct (thin spaces around em dashes):**

```html
<p>Typography&thinsp;[em dash character]&thinsp;the art of type&thinsp;[em dash character]&thinsp;matters.</p>
```

**Common uses:**

| Context | Spacing |
|---------|---------|
| Around em dashes | `&thinsp;` or `&hairsp;` |
| Between quote and attribution | `&hairsp;` |
| Around midpoint separators | `&thinsp;` |
| Between units and values | `&thinsp;` (e.g., 5&thinsp;kg) |

Use `&hairsp;` (U+200A, thinnest) when `&thinsp;` (U+2009) still feels too wide.
