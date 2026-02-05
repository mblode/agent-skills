---
title: Use Prime Marks for Measurements
impact: CRITICAL
tags: primes, measurements, feet, inches, minutes, seconds
---

## Use Prime Marks for Measurements

Prime (\u2032) and double prime (\u2033) marks are distinct from quotation marks and apostrophes. Use them for feet/inches, minutes/seconds, and coordinates. Never substitute curly quotes or straight quotes for primes.

**Incorrect (quotes used as primes):**

```html
<p>The board is 6' 2" long.</p>
<p>The coordinates are 40\u00b0 26' 46" N.</p>
```

**Correct (true prime characters):**

```html
<p>The board is 6&prime; 2&Prime; long.</p>
<p>The coordinates are 40&deg; 26&prime; 46&Prime; N.</p>
```

**Key characters:**

| Character | Name | HTML Entity | Unicode |
|-----------|------|-------------|---------|
| \u2032 | Prime (single) | `&prime;` | U+2032 |
| \u2033 | Double prime | `&Prime;` | U+2033 |

Primes should lean slightly to the right, distinct from the curly shape of apostrophes.
