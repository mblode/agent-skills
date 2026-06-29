---
title: Use heading levels in order
impact: CRITICAL
tags: structure, headings, hierarchy, accessibility
---

## Use heading levels in order

Don't skip heading levels: go H2, H3, H4 in sequence. Skipping breaks the outline, confuses screen readers, and makes the table of contents wrong. Use a single H1 for the page title; organize content under H2 sections.

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

Tip: Reaching H5 or H6 means the page covers too many topics. Split it into multiple documents.

Reference: [Microsoft Writing Style Guide: Headings](https://learn.microsoft.com/en-us/style-guide/scannable-content/headings)
