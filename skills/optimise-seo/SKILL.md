---
name: optimise-seo
version: 0.1.0
description: This skill should be used when the user asks to "improve SEO", "add sitemap.xml", "fix meta tags", "add structured data", "set canonical URLs", "improve Core Web Vitals", "audit SEO", "programmatic SEO", or "build SEO pages at scale" in a Next.js App Router app. Perform no visual redesigns.
---

# Optimise SEO

Practical SEO improvements for Next.js App Router without visual redesign.

## Constraints
- No visual redesigns or layout changes. Allowed: metadata, structured data, semantic HTML, internal links, alt text, sitemap/robots, performance tuning.

## Quick workflow
1) Inventory routes and index intent
2) Fix crawl/index foundations
3) Implement metadata + structured data
4) Improve semantics, links, and CWV
5) Validate and document

## Must-have
- Sitemap (`app/sitemap.ts`) and robots (`app/robots.ts`)
- Canonicals consistent on every page
- Unique titles + descriptions
- OpenGraph + Twitter Card tags
- JSON-LD: Organization, WebSite, BreadcrumbList (+ Article/Product/FAQ as needed)
- One h1 and logical headings; semantic HTML
- Alt text, internal links, CWV targets, mobile/desktop parity

## Programmatic SEO (pages at scale)
- Validate demand for a repeatable pattern before generating pages
- Require unique value per page and defensible data
- Use clean subfolder URLs, hubs/spokes, and breadcrumbs
- Index only strong pages; monitor indexation and cannibalization

## SEO audit (triage order)
1) Crawl/index: robots, sitemap, noindex, canonicals, redirects, soft 404s
2) Technical: HTTPS, CWV, mobile parity
3) On-page/content: titles/H1, internal links, remove or noindex thin pages

## Outputs
- List files changed and why
- Provide validation results and remaining issues

## Resources
- `nextjs-implementation.md` when implementing steps 2-4 (metadata, sitemap/robots, JSON-LD, OG images, performance)
- `seo-checklist.md` during step 5 to record pass/fail status before final handoff

## Don't
- Duplicate or missing titles/descriptions
- Block crawlers unintentionally
- Omit or conflict canonicals
- Rely on JS-only rendering without SSR/SSG
- Use generic or missing alt text
- Use headings for styling
- Over-generate thin pages or doorway pages
- Keyword stuff or create cannibalization
- Perform visual redesigns or layout changes

## Validation
```bash
# Crawl and index foundations
curl -I https://site.com
curl -s https://site.com/robots.txt
curl -s https://site.com/sitemap.xml | head -n 20

# Verify page-level tags on representative URLs
curl -s https://site.com/page | rg -n 'rel="canonical"|property="og:|name="twitter:'

# CWV/SEO baseline
lighthouse https://site.com --output=json --output-path=report.json
cat report.json | jq '.categories.seo.score * 100'  # Target: 90+
```
- Validate JSON-LD with Rich Results Test and note pass/fail by URL.
- Report remaining blockers with exact URLs and owner/action.
