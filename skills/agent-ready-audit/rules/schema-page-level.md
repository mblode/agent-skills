---
title: Page-level JSON-LD
impact: MEDIUM-HIGH
tags: structured-data, json-ld, schema-org
---

## Page-level JSON-LD

Every content page needs `WebPage` (or a subtype like `Article`, `FAQPage`, `Product`) plus `BreadcrumbList` JSON-LD. Use `sameAs` for entity disambiguation across external sources.

**Failing:**

Content pages with no JSON-LD — agents see unstructured HTML with no semantic meaning.

**Passing:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://example.com/blog/post-1#article",
      "headline": "Getting Started with Widgets",
      "author": {"@id": "https://example.com/#organization"},
      "datePublished": "2026-01-15",
      "dateModified": "2026-03-20"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com"},
        {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog"},
        {"@type": "ListItem", "position": 3, "name": "Getting Started with Widgets"}
      ]
    }
  ]
}
</script>
```

Use `FAQPage` for Q&A content — it has the highest single-type value for AI citations because LLMs extract Q&A pairs directly.
