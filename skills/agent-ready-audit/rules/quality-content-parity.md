---
title: Markdown-HTML content parity
impact: MEDIUM
tags: content-quality, markdown, parity
---

## Markdown-HTML content parity

When serving markdown via content negotiation, the markdown version must contain the same content as the HTML version. Less than 5% content difference is acceptable (minor formatting variations). Significant gaps mean agents get incomplete information.

**Failing:**

HTML page shows 15 API endpoints but markdown version only includes 8 — the content negotiation pipeline drops content from tabbed/accordion UI that wasn't expanded during conversion.

**Passing:**

Markdown version includes all content from all tabs, accordions, and expandable sections. Test by comparing word count and section headings between HTML and markdown variants.
