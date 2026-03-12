---
name: optimise-seo
description: Optimises SEO for Next.js App Router apps including sitemaps, meta tags, structured data, canonical URLs, Core Web Vitals, and programmatic SEO. Use when asked to improve SEO, add sitemap.xml, fix meta tags, add structured data, set canonical URLs, improve Core Web Vitals, audit SEO, or build SEO pages at scale. Performs no visual redesigns.
---

# Optimise SEO

No visual redesigns or layout changes. Allowed: metadata, structured data, semantic HTML, internal links, alt text, sitemap/robots, performance tuning.

## Workflow
1. Inventory routes and index intent
2. Fix crawl/index foundations
3. Implement metadata + structured data
4. Improve semantics, links, and CWV
5. Validate with [seo-checklist.md](seo-checklist.md) and document changes

## Must-have
- Sitemap (`app/sitemap.ts`) and robots (`app/robots.ts`):
  ```ts
  // app/sitemap.ts
  import type { MetadataRoute } from "next";
  export default function sitemap(): MetadataRoute.Sitemap {
    return [{ url: "https://example.com", lastModified: new Date() }];
  }
  ```
- Canonicals consistent on every page
- Unique titles + descriptions via `metadata` or `generateMetadata`
- OpenGraph + Twitter Card tags
- JSON-LD: Organization, WebSite, BreadcrumbList (+ Article/Product/FAQ as needed):
  ```tsx
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org", "@type": "Organization",
    name: "Example", url: "https://example.com"
  }) }} />
  ```
- One h1 and logical heading hierarchy
- Alt text, internal links, CWV targets, mobile/desktop parity

## Programmatic SEO (pages at scale)
- Validate demand for a repeatable pattern before generating pages
- Require unique value per page and defensible data
- Clean subfolder URLs, hubs/spokes, and breadcrumbs
- Index only strong pages; monitor indexation and cannibalization

## SEO audit (triage order)
1. Crawl/index: robots, sitemap, noindex, canonicals, redirects, soft 404s
2. Technical: HTTPS, CWV, mobile parity
3. On-page/content: titles/H1, internal links, remove or noindex thin pages

## Don't
- Over-generate thin pages or doorway pages
- Omit or conflict canonicals
- Block crawlers unintentionally
- Rely on JS-only rendering without SSR/SSG

## Resources
- [nextjs-implementation.md](nextjs-implementation.md) — implementation patterns for steps 2-4
- [seo-checklist.md](seo-checklist.md) — pass/fail validation during step 5

## Validation
- Check HTTP response headers for correct status codes and redirects
- Confirm `robots.txt` has correct crawl directives
- Confirm `sitemap.xml` lists all indexed routes with valid URLs
- Verify pages include canonical, OpenGraph, and Twitter Card tags in source HTML
- Run a Lighthouse audit and confirm performance scores meet targets
- Validate JSON-LD with Rich Results Test per URL
- Report remaining blockers with exact URLs and owner/action
