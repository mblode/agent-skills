---
title: Use Appropriate Body Text Weight
impact: CRITICAL
tags: font-weight, body-text, legibility, thin-fonts
---

## Use Appropriate Body Text Weight

Set body text weight to regular (400) or book/medium (500). Avoid ultra-light or thin weights for longform reading \u2014 they lack sufficient contrast against the background, especially on low-resolution screens. Use heavier weights only at large display sizes.

Test rendering across platforms: fonts often appear thinner on macOS than on Windows.

**Incorrect (ultra-light body text):**

```css
body {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 200; /* ultra-light, hard to read at body sizes */
  font-size: 16px;
}
```

**Correct (readable body weight):**

```css
body {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 400; /* regular weight for body */
  font-size: 18px;
}

/* Thin weights reserved for large display text */
.hero-title {
  font-weight: 200;
  font-size: 72px;
}
```
