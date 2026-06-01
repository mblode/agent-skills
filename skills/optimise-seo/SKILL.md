---
name: optimise-seo
description: Optimises SEO and technical foundations for Next.js App Router apps including sitemaps, meta tags, structured data, canonical URLs, redirects, indexing policy, hreflang/internationalisation, Core Web Vitals, security headers, privacy/consent, and error-page resilience. Use when asked to improve SEO, add sitemap.xml, fix meta tags, add structured data, set canonical URLs, set up redirects, fix soft 404s, add hreflang, add security headers (CSP/HSTS), add cookie consent or a privacy policy, fix error pages, improve Core Web Vitals, audit SEO, or build SEO pages at scale. Performs no visual redesigns.
---

# Optimise SEO

No visual redesigns or layout changes. Allowed: metadata, structured data, semantic HTML, internal links, alt text, sitemap/robots, redirects, indexing policy, hreflang/i18n, security and privacy headers, error-page status codes, performance tuning.

## Workflow

Copy and track this checklist:

```text
SEO progress:
- [ ] Step 1: Inventory routes and index intent
- [ ] Step 2: Fix crawl/index foundations
- [ ] Step 3: Implement metadata + structured data
- [ ] Step 4: Improve semantics, links, and CWV
- [ ] Step 5: Validate with seo-checklist.md and document changes
```

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

## Redirects & indexing policy
- Permanent moves use 301/308; temporary use 302/307. Never chain redirects — point straight to the final URL.
- A "not found" page must return a real 404, not 200 with a friendly message (a soft 404 — search engines refuse to index these).
- Give every page an explicit indexing policy: public pages default to `index, follow`; mark staging, admin, thin, or private routes `noindex` (HTML `metadata.robots`) or `X-Robots-Tag` (non-HTML / whole environments).

## Internationalisation (multi-locale sites)
- One URL pattern for all locales; reciprocal `hreflang` with self-ref + `x-default`; translate metadata, not just body; no IP/`Accept-Language` auto-redirects.
- Details and `generateMetadata` pattern: [internationalisation.md](internationalisation.md).

## Technical hardening (security, privacy, resilience)
- Security headers (HSTS, CSP, `nosniff`, `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`), SRI, cookie flags, `security.txt`.
- Privacy: policy, opt-in cookie consent, Global Privacy Control, cookieless analytics, data minimisation.
- Resilience: correct 404/500 status codes, 503 + `Retry-After`, web app manifest, external monitoring.
- Full guidance: [technical-hardening.md](technical-hardening.md).

## Gotchas
- Don't over-generate thin or doorway pages — indexation drops and quality signals suffer.
- Don't omit canonicals or let them conflict across variants (trailing slash, www, uppercase) — search engines split ranking signal.
- Don't block crawlers unintentionally via `robots.txt`, `noindex`, or auth walls on routes meant to be indexed.
- Don't rely on JS-only rendering without SSR/SSG for indexable content.
- Don't change URLs without 301 redirects — link equity and crawl budget are lost.
- Don't add JSON-LD that doesn't match visible page content — Google treats this as spam and may demote the page.
- Don't return 200 for "not found" or error pages — soft 404s are a quality problem and won't index.
- Don't ship `hreflang` that isn't reciprocal across every alternate — search engines ignore non-mutual sets.
- Don't take a maintenance window down with a 200 or 404 — return 503 + `Retry-After` so the site isn't deindexed.
- Don't add `Strict-Transport-Security` with `preload`/`includeSubDomains` before every subdomain is HTTPS — it's effectively irreversible.

## Resources
- [nextjs-implementation.md](nextjs-implementation.md) — implementation patterns for steps 2-4
- [internationalisation.md](internationalisation.md) — hreflang, URL strategy, localised metadata
- [technical-hardening.md](technical-hardening.md) — security headers, privacy/consent, resilience
- [seo-checklist.md](seo-checklist.md) — pass/fail validation during step 5

## Validation
- Check HTTP response headers for correct status codes and redirects
- Confirm `robots.txt` has correct crawl directives
- Confirm `sitemap.xml` lists all indexed routes with valid URLs
- Verify pages include canonical, OpenGraph, and Twitter Card tags in source HTML
- Run a Lighthouse audit and confirm performance scores meet targets
- Validate JSON-LD with Rich Results Test per URL
- Report remaining blockers with exact URLs and owner/action
