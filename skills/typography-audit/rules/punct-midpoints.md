---
title: Use Midpoint Separators with Thin Spaces
impact: CRITICAL
tags: midpoint, interpunct, separator, thin-space
---

## Use Midpoint Separators with Thin Spaces

Prefer midpoints (\u00b7) over pipes (|) or bullets (\u2022) for inline horizontal list separators. Use hair spaces (`&hairsp;`) or thin spaces (`&thinsp;`) on either side of the midpoint for correct spacing.

**Incorrect (pipes or bullets as separators):**

```html
<span>About | Blog | Contact</span>
<span>About &bull; Blog &bull; Contact</span>
```

**Correct (midpoints with thin spaces):**

```html
<span>About&thinsp;&middot;&thinsp;Blog&thinsp;&middot;&thinsp;Contact</span>
```

Use the correct midpoint character: `&middot;` (U+00B7), not a period or bullet.
