---
title: OpenGraph tag completeness
impact: MEDIUM
tags: structured-data, opengraph, meta
---

## OpenGraph tag completeness

Every page needs complete OpenGraph tags. AI crawlers parse the full `<head>` — OG tags provide structured, machine-readable labels that reinforce semantic meaning alongside JSON-LD.

**Failing:**

```html
<head>
  <title>Example</title>
  <meta property="og:title" content="Example" />
  <!-- Missing og:type, og:image, og:url, og:description -->
</head>
```

**Passing:**

```html
<head>
  <title>Example — Getting Started</title>
  <meta property="og:title" content="Getting Started — Example" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://example.com/docs/start" />
  <meta property="og:image" content="https://example.com/og/start.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Getting Started guide overview" />
  <meta property="og:description" content="Quick start guide for building with Example." />
</head>
```
