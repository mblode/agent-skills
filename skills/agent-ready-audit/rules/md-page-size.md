---
title: Page size under truncation limit
impact: HIGH
tags: markdown, size, truncation
---

## Page size under truncation limit

Markdown content per page must stay under 50K characters. Pages between 50-100K trigger warnings; over 100K will be truncated by most agent tools. Claude Code's limit is ~100KB.

**Failing:**

A single page with 85K characters of markdown — agent tools will truncate, losing content at the end of the page.

**Passing:**

Page content under 50K characters. For longer content, split into multiple pages and link between them. Tabbed/accordion UI should serialize to under 50K when all tabs are expanded.
