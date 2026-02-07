---
title: Use heading levels in order
impact: CRITICAL
tags: structure, headings, hierarchy, accessibility
---

## Use heading levels in order

Don't skip heading levels. Go from H2 to H3 to H4 in sequence. Skipping levels (H2 to H4) breaks the logical outline, confuses screen readers, and makes the table of contents look wrong. Heading levels communicate nesting depth, so they must be sequential.

Use a single H1 for the page title. Organize all content under H2 sections, with H3 and H4 for subsections as needed.

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
