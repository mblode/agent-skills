---
name: optimise-seo
description: Optimises SEO and technical foundations for Next.js App Router apps, covering sitemaps, robots, meta tags, structured data, canonical URLs, redirects, indexing policy, hreflang and internationalisation, Core Web Vitals, programmatic SEO, security headers, privacy/consent, and error-page resilience. Use when asked to "improve SEO", "add a sitemap", "fix meta tags", "add structured data", "set canonical URLs", "set up redirects", "fix soft 404s", "add hreflang", "add security headers", "add cookie consent", "improve Core Web Vitals", "audit SEO", or "build SEO pages at scale". Performs no visual redesigns; for visual direction use ui-design, for page-level UI quality use ui-audit. Does not cover llms.txt or AI-agent readability; research current specs for that work.
---

# Optimise SEO

- **IS:** crawlability, metadata, structured data, canonicals, redirects, hreflang, Core Web Vitals, programmatic SEO, security/privacy headers, and error-page status behaviour for Next.js App Router apps.
- **IS NOT:** visual redesigns or layout changes (use `ui-design`), or page-level UI quality review (use `ui-audit`). Making a site readable by AI agents (llms.txt, MCP discovery, WebMCP) is out of scope; research current specs rather than relying on static SEO guidance.

Allowed surface: metadata, structured data, semantic HTML, internal links, alt text, `app/sitemap.ts`, `app/robots.ts`, `next.config.ts` redirects and headers, error pages, performance tuning. Never touch component styling or layout.

## Workflow

Copy and track this checklist:

```text
SEO progress:
- [ ] Step 1: Inventory routes and decide index intent per route
- [ ] Step 2: Fix crawl/index foundations (sitemap, robots, canonicals, redirects, status codes)
- [ ] Step 3: Implement metadata + structured data
- [ ] Step 4: Improve semantics, internal links, and Core Web Vitals
- [ ] Step 5: Validate with references/seo-checklist.md and report evidence
```

Before writing code for steps 2-4, read [references/nextjs-implementation.md](references/nextjs-implementation.md): App Router patterns (Metadata API, `generateMetadata`, sitemap index, JSON-LD component, OG image generation, `headers()`/`redirects()` config).

## Must-have on every site

- `app/sitemap.ts` lists all public URLs; `app/robots.ts` links to it
- Canonical URL set and consistent on every page (one host, one casing, one trailing-slash policy)
- Unique title and description per page via `metadata` or `generateMetadata`
- OpenGraph + Twitter Card tags with a 1200x630 image
- JSON-LD: Organization and WebSite on the homepage, BreadcrumbList on inner pages, plus Article/Product/FAQ where the content type matches. Define each entity once in a `@graph` with a stable `@id` (`/#person`, `/#website`, `/#organization`); reference by `@id`, don't duplicate. On articles keep `Person` as `author`, use an `Organization` (with a `logo`) as `publisher`
- One h1 per page with logical h2-h6 hierarchy
- Descriptive alt text, internal links between related pages, CWV in target (LCP < 2.5s, INP < 200ms, CLS < 0.1)

## Programmatic SEO (pages at scale)

- Validate search demand for the pattern before generating pages
- Each page needs unique value backed by defensible data; templated text swaps are doorway pages
- Clean subfolder URLs, hub-and-spoke linking, breadcrumbs on every page
- Index only strong pages; `noindex` the long tail and monitor indexation and cannibalisation in Search Console
- Applies to single pages too: `noindex` a thin page and omit it from the sitemap until it carries unique content, then add an internal link and index it

## SEO audit (triage order)

1. Crawl/index: robots, sitemap, stray `noindex`, canonicals, redirect chains, soft 404s
2. Technical: HTTPS, Core Web Vitals, mobile/desktop parity
3. On-page: titles/H1 uniqueness, internal links, remove or `noindex` thin pages
4. Orphans: indexable pages (metadata, canonical, breadcrumb) with no internal link or sitemap entry. Either give them a crawl path (nav/footer link plus sitemap) or `noindex` and drop from the sitemap

## Redirects and indexing policy

- Permanent moves use 301/308, temporary use 302/307. Never chain; point straight to the final URL.
- A missing page must return a real 404, not 200 with a friendly message: 200-for-missing is a soft 404 and won't index.
- Give every route an explicit index decision: public pages default to `index, follow`; staging, admin, thin, or private routes get `metadata.robots` noindex (HTML) or `X-Robots-Tag` (non-HTML, whole environments).

## Internationalisation (multi-locale sites)

One URL pattern for all locales; reciprocal `hreflang` with self-reference plus `x-default`; translate metadata, not just body; never auto-redirect by IP or `Accept-Language`. Full rules and the `generateMetadata` pattern: [references/internationalisation.md](references/internationalisation.md).

## Technical hardening (security, privacy, resilience)

Security headers (HSTS, CSP, `nosniff`, `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`), SRI, cookie flags, `security.txt`, privacy policy and opt-in consent, correct 404/500/503 behaviour, web app manifest. Read [references/technical-hardening.md](references/technical-hardening.md) for header, cookie, consent, or error-page tasks.

## Gotchas

- Don't over-generate thin or doorway pages: indexation drops and sitewide quality signals suffer.
- Don't let canonicals conflict across variants (trailing slash, www, uppercase): ranking signal splits between duplicates.
- Don't block crawlers via `robots.txt`, `noindex`, or auth walls on routes meant to rank; check before shipping, not after traffic drops.
- Don't rely on client-only JS rendering for indexable content; ship SSR/SSG HTML.
- Don't change URLs without 301/308 redirects: link equity and crawl budget are lost.
- Don't add JSON-LD that doesn't match visible content; Google treats it as spam and may demote the page.
- Don't return 200 for "not found" or error pages: soft 404s won't index and drag quality scores down.
- Don't ship `hreflang` that isn't reciprocal across every alternate; search engines ignore non-mutual sets.
- Don't serve a maintenance window with 200 or 404: return 503 + `Retry-After` so the site isn't deindexed.
- Don't add `Strict-Transport-Security` with `preload`/`includeSubDomains` before every subdomain is HTTPS; it's effectively irreversible.
- Don't set `Person` as `publisher` on articles: rich results expect an `Organization` publisher with a `logo`. Keep `Person` as `author`.
- Don't stop at required schema fields: Search Console flags missing recommended fields as rich-result warnings (e.g. Event wants `endDate`, `offers`, `image`, `eventStatus`, `eventAttendanceMode`, address, `organizer.url`). Clear warnings, not just errors.
- Don't hardcode the sitemap `lastModified`: it goes stale and signals dead content. Derive it from the most recent content date.
- Don't leave indexable pages orphaned: no internal link wastes crawl equity and the page may never be discovered or ranked.

## References

- [references/nextjs-implementation.md](references/nextjs-implementation.md): App Router code patterns; read before steps 2-4
- [references/internationalisation.md](references/internationalisation.md): URL strategy, hreflang, localised metadata; read for multi-locale sites
- [references/technical-hardening.md](references/technical-hardening.md): security headers, privacy/consent, resilience; read for hardening tasks
- [references/seo-checklist.md](references/seo-checklist.md): pass/fail validation checklist; copy during step 5

## Related skills

- `ui-design`: visual direction, palettes, typography, landing-page CRO
- `ui-audit`: page-level UI quality and rendered i18n behavior (locale formatting, plurals, RTL); `optimise-seo` owns hreflang and localized metadata

## Validation (step 5, evidence required)

Copy [references/seo-checklist.md](references/seo-checklist.md), mark every item pass/fail, then attach command evidence:

| Check | Command/source | Expected result |
|---|---|---|
| Production build | `npm run build` or repo equivalent | exits 0 |
| Response headers | `curl -sI <url>` | correct status, redirects, canonical host |
| Served HTML metadata | `curl -s <url> \| rg "canonical\|og:\|twitter:\|application/ld\+json"` | tags present in source |
| Robots | `curl -s <origin>/robots.txt` | expected allow/disallow and sitemap |
| Sitemap | `curl -s <origin>/sitemap.xml` | indexed routes, absolute URLs, fresh `lastmod` when used |
| Lighthouse | `npx lighthouse <url> --only-categories=seo,performance --output=json --output-path=.lighthouse-seo.json` | SEO and Performance >= 90, or blockers listed |
| JSON-LD | Google Rich Results Test URL/result | valid or documented unsupported schema |
| Search Console after deploy | Pages/Coverage and enhancement reports | no new warnings; indexed/excluded changes explained |

Report remaining blockers with exact URLs and owner/action.
