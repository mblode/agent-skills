---
title: Use Proper Fraction and Math Entities
impact: MEDIUM
tags: fractions, multiplication, math, entities
---

## Use Proper Fraction and Math Entities

Use Unicode fraction characters and proper math symbols instead of improvised alternatives. The multiplication sign (×) is not the letter "x". Standard fractions have dedicated Unicode characters.

**Incorrect (improvised fractions and symbols):**

```html
<p>The display is 1920x1080 pixels.</p>
<p>Add 1/2 cup of flour and 3/4 tsp salt.</p>
```

**Correct (proper entities):**

```html
<p>The display is 1920&times;1080 pixels.</p>
<p>Add &frac12; cup of flour and &frac34; tsp salt.</p>
```

**Common fraction entities:**

| Fraction | Entity | Unicode |
|----------|--------|---------|
| ½ | `&frac12;` | U+00BD |
| ¼ | `&frac14;` | U+00BC |
| ¾ | `&frac34;` | U+00BE |
| ⅓ | `&#8531;` | U+2153 |
| ⅔ | `&#8532;` | U+2154 |
