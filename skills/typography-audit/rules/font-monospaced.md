---
title: Reserve Monospaced Fonts for Short Blocks
impact: CRITICAL
tags: monospace, code, body-text, readability
---

## Reserve Monospaced Fonts for Short Blocks

Monospaced fonts reduce readability in long text because uniform letter widths disrupt natural reading rhythm. Use them only for code blocks, terminal output, and short stylistic elements. Never set body copy in a monospaced face.

**Incorrect (monospace for body text):**

```css
body {
  font-family: 'Fira Mono', monospace;
  font-size: 16px;
}
```

**Correct (proportional for body, mono for code):**

```css
body {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
}

code, pre {
  font-family: 'Fira Code', 'Fira Mono', monospace;
  font-size: 0.9em;
}
```

Brief monospaced sections (e.g., a stylistic data readout or a hero element) are acceptable as a design choice, but keep them short.
