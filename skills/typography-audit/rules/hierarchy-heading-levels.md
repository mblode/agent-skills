---
title: Keep Heading Levels Shallow and Descriptive
impact: MEDIUM-HIGH
tags: headings, h1, h2, h3, semantic, skimmable
---

## Keep Heading Levels Shallow and Descriptive

Limit heading depth to h1\u2013h3 in most contexts. Deeper levels (h4\u2013h6) often indicate content that should be restructured. Write descriptive, skimmable headings that tell the reader what the section contains \u2014 not generic labels.

Avoid heading colors that match link colors (causes confusion). Avoid all-italic headings (they feel weak).

**Incorrect (deep nesting, generic headings):**

```html
<h1>Documentation</h1>
<h2>Getting Started</h2>
<h3>Prerequisites</h3>
<h4>System Requirements</h4>
<h5>Minimum Specifications</h5>  <!-- too deep -->
<h6>Processor</h6>              <!-- way too deep -->
```

**Correct (shallow, descriptive headings):**

```html
<h1>Documentation</h1>
<h2>Install on macOS, Linux, or Windows</h2>
<h3>System requirements</h3>
<!-- Restructure deeper content as lists or prose -->
```

Use `text-transform: uppercase` or `text-transform: capitalize` in CSS rather than typing headings in all caps in the HTML.
