---
title: Use heading levels in order
impact: CRITICAL
tags: structure, headings, hierarchy, accessibility
---

## Use heading levels in order

Don't skip heading levels -- go from H2 to H3 to H4 in sequence. Skipping levels breaks the logical outline, confuses screen readers, and makes the table of contents wrong. Use a single H1 for the page title and organize content under H2 sections.

**Incorrect (skipped heading levels):**

```markdown
# Getting started

#### Prerequisites

Content here...

## Installation

#### macOS

Content here...
```

**Correct (sequential heading levels):**

```markdown
# Getting started

## Prerequisites

Content here...

## Installation

### macOS

Content here...

### Linux

Content here...
```

Tip: If you find yourself reaching H5 or H6, the page probably covers too many topics. Consider splitting it into multiple documents.

Reference: [Microsoft Writing Style Guide — Headings](https://learn.microsoft.com/en-us/style-guide/scannable-content/headings)
