---
name: optimise-seo
description: Optimise SEO for Next.js. Sitemaps, meta tags, structured data, Core Web Vitals. No UI changes.
---

# Optimise SEO

Essential optimisations for search visibility.

## Must-have
- Unique title (50-60 chars) and description (150-160 chars) per page
- Dynamic sitemap.xml (`app/sitemap.ts`)
- Robots.txt allowing crawlers (`app/robots.ts`)
- JSON-LD: Organization, WebSite, BreadcrumbList
- Canonical URLs on all pages
- OpenGraph and Twitter Card meta tags
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`
- Single h1 per page, logical h2-h6 hierarchy
- Alt text on all images
- Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1

## Don't
- Duplicate/missing meta titles or descriptions
- Block crawlers incorrectly
- Missing canonical URLs
- JavaScript-only rendering without SSR/SSG
- Generic/missing image alt text
- Use headings for styling

## Implementation
See `nextjs-implementation.md` for code examples.

## Validation
```bash
lighthouse https://site.com --output=json --output-path=report.json
cat report.json | jq '.categories.seo.score * 100'  # Target: 90+
```
