---
title: Copyright, Trademark, and Registered Marks
impact: CRITICAL
tags: copyright, trademark, registered, symbols, superscript
---

## Copyright, Trademark, and Registered Marks

Use correct Unicode characters or HTML entities for \u00a9, \u2122, and \u00ae. Trademark and registered marks should appear as superscripts. Copyright should be inline at the same size as surrounding text. Do not duplicate the word and symbol (e.g., avoid "Copyright \u00a9").

Use a non-breaking space (`&nbsp;`) between the copyright symbol and the year.

**Incorrect (wrong formatting):**

```html
<p>Copyright (c) 2025 Acme Corp</p>
<p>Acme(TM) Widget</p>
<p>Copyright &copy; 2025</p>  <!-- missing non-breaking space -->
```

**Correct (proper symbols and spacing):**

```html
<p>&copy;&nbsp;2025 Acme Corp</p>
<p>Acme<sup>&trade;</sup> Widget</p>
<p>Acme<sup>&reg;</sup> Widget</p>
```

```css
/* Ensure superscript marks are sized appropriately */
sup {
  font-size: 0.6em;
  vertical-align: super;
}
```
