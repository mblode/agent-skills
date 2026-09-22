---
title: Set a Readable Type Scale
id: type-readable-scale
category: type
defaultTier: fix-this-sprint
detect: static
---

## Set a Readable Type Scale

Use body sizes and weights readable across desktop and mobile. Undersized or underweight body text slows scanning and tires readers.

## Detection

Search for a base text rule (`body`, `html`, `:root`, `.prose`) that sets a size below 16px or a weight under 400.

```bash
rg -nUP '(?:\bbody\b|\bhtml\b|:root|\.prose)[^{}/]*\{[^}]*font-(?:size:\s*(?:0?\.\d+rem|(?<![\d.])(?:\d|1[0-5])(?:\.\d+)?px)|weight:\s*[123]00\b)' -g '*.css' -g '*.scss' src/
```

A light weight on a large-format `.prose` variant (marketing body set at 20px and up) matches and reads fine, since weight tolerance rises with size. Read the `font-size` in the same block before reporting.

**Incorrect (too small and too light):**

```css
body {
  font-size: 12px;
  font-weight: 300;
  line-height: 1.2;
}
```

**Correct (readable defaults):**

```css
body {
  font-size: clamp(0.95rem, 0.2vw + 0.9rem, 1.125rem);
  font-weight: 400;
  line-height: 1.45;
}
```
