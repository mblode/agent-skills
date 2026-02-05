---
title: Use Hair and Thin Spaces for Fine Adjustments
impact: HIGH
tags: hair-space, thin-space, em-dash, citations, spacing
---

## Use Hair and Thin Spaces for Fine Adjustments

When a full word space feels too wide and no space feels too tight, use hair spaces (`&hairsp;`) or thin spaces (`&thinsp;`). Common applications: around em dashes, after citations, between nested punctuation marks, and around special characters.

**Incorrect (no space or full space around em dashes):**

```html
<p>Typography\u2014the art of type\u2014matters.</p>     <!-- too tight -->
<p>Typography \u2014 the art of type \u2014 matters.</p>  <!-- too loose -->
```

**Correct (thin spaces around em dashes):**

```html
<p>Typography&thinsp;&mdash;&thinsp;the art of type&thinsp;&mdash;&thinsp;matters.</p>
```

**Common uses:**

| Context | Spacing |
|---------|---------|
| Around em dashes | `&thinsp;` or `&hairsp;` |
| Between quote and attribution | `&hairsp;` |
| Around midpoint separators | `&thinsp;` |
| Between units and values | `&thinsp;` (e.g., 5&thinsp;kg) |

Use `&hairsp;` (U+200A, thinnest) when `&thinsp;` (U+2009) still feels too wide.
