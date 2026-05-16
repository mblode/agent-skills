---
title: Foundation JSON-LD schemas
impact: MEDIUM-HIGH
tags: structured-data, json-ld, schema-org
---

## Foundation JSON-LD schemas

Homepage must include `WebSite` and `Organization` JSON-LD. Use `@graph` to define multiple entities in one block. Give every entity a stable `@id` and cross-reference between them.

**Failing:**

```html
<!-- No JSON-LD on homepage -->
```

**Passing:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Example Inc",
      "url": "https://example.com",
      "sameAs": ["https://twitter.com/example", "https://github.com/example"]
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "url": "https://example.com",
      "name": "Example",
      "publisher": {"@id": "https://example.com/#organization"},
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://example.com/search?q={search_term}",
        "query-input": "required name=search_term"
      }
    }
  ]
}
</script>
```
