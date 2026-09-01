---
name: optimise-seo
description: Implements SEO and technical foundations in Next.js App Router codebases, covering sitemap and robots metadata routes, generateMetadata titles and canonicals, JSON-LD structured data, 308/307 redirects, indexing policy and soft-404 status codes, hreflang, Core Web Vitals, AI-crawler policy (per-crawler robots rules, llms.txt, Content-Signal), programmatic SEO, security headers, consent, and error-page resilience. Use when asked to "improve SEO", "add a sitemap", "fix meta tags", "add structured data", "set canonical URLs", "set up redirects", "fix soft 404s", "add hreflang", "add llms.txt", "block GPTBot", "add security headers", "add cookie consent", "improve Core Web Vitals", "audit SEO", or "build SEO pages at scale". Ships code, not strategy. For keyword research, briefs, and Search Console monitoring use seo-program; for visual direction or UI quality use ui-design; for per-tenant robots and sitemap routing use multi-tenant-architecture; for the article itself use the external ghostwriter skill.
---

# Optimise SEO

- **IS:** crawlability, metadata, structured data, canonicals, redirects, status codes, hreflang, AI-crawler policy and extractable page structure, Core Web Vitals, programmatic SEO, security and privacy headers, and error-page behaviour, implemented in a Next.js App Router codebase.
- **IS NOT:** visual redesign, layout, or page-level UI quality (`ui-design` Direction, Build, and Audit modes), demand research, briefs, question maps, or Search Console monitoring (`seo-program`), tenant routing for `robots.txt` and `sitemap.xml` (`multi-tenant-architecture`), or writing the article (external `ghostwriter`).

Allowed surface: `metadata` and `generateMetadata`, JSON-LD, semantic HTML, internal links, alt text, `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts`, `proxy.ts`, `next.config.ts` redirects and headers, error pages, and performance work. Component styling and layout stay as they are; when a fix needs a layout change, name it as a handoff to `ui-design`.

## References

| File | Read when |
|---|---|
| [references/nextjs-implementation.md](references/nextjs-implementation.md) | Before writing code in steps 2-4: metadata, sitemap and robots, redirects, indexing, streaming 404s, JSON-LD, OG images, CSP |
| [references/answer-engines.md](references/answer-engines.md) | The task touches AI crawlers, `robots.ts` rules for GPTBot or ClaudeBot, `llms.txt`, Content-Signal, or "why are we not cited" |
| [references/internationalisation.md](references/internationalisation.md) | The site has more than one locale |
| [references/technical-hardening.md](references/technical-hardening.md) | Headers, cookies, consent, GPC, `security.txt`, or maintenance and error-status tasks |
| [references/seo-checklist.md](references/seo-checklist.md) | Step 5: copy into the report and mark each line with evidence |

## Workflow

Copy and track this checklist:

```text
SEO progress:
- [ ] Step 1: Inventory routes and decide index intent per route
- [ ] Step 2: Fix crawl/index foundations (sitemap, robots, canonicals, redirects, status codes)
- [ ] Step 3: Implement metadata and structured data
- [ ] Step 4: Improve semantics, extractable answers, internal links, and Core Web Vitals
- [ ] Step 5: Validate with references/seo-checklist.md and report evidence
```

Step 1 is a table: route, index or noindex, canonical, reason. Every later step reads from it, and a route with no row gets no work.

## Must-have on every site

- `app/sitemap.ts` lists every indexable URL with `lastModified` derived from content; `app/robots.ts` names it
- One canonical per page, one host, one casing, one trailing-slash policy, set through `alternates.canonical` with `metadataBase` in the root layout
- Unique title and description per page; title and H1 lead with the non-brand primary keyword and agree in intent (a brand-led title on a category page competes only for navigational queries the site already wins)
- Every page opens with a short, plain-text answer to the question it exists to answer; the h2s are the questions people actually ask
- Open Graph and Twitter Card tags with a 1200x630 image
- JSON-LD: Organization and WebSite once in a root `@graph` with stable `@id`s, BreadcrumbList on inner pages, then Article, Product, ProfilePage, or LocalBusiness where the content type matches. Define an entity once and reference it by `@id`
- One h1, logical h2-h6, descriptive alt text, internal links between related pages
- Core Web Vitals in target at the p75 of CrUX field data: LCP 2.5 s, INP 200 ms, CLS 0.1 (INP replaced FID in March 2024; a guide still naming FID is stale)

## Redirects and indexing policy

- Permanent moves are 308 (`permanent: true`, `permanentRedirect()`); temporary are 307. One hop, straight to the final URL, and set at one layer (edge or `next.config.ts`, not both).
- A missing page returns a real 404. In the App Router that means `notFound()` runs before anything streams; otherwise the response is 200 plus a `noindex` meta, which Search Console reports as a soft 404.
- Every route has an explicit index decision. Public pages are `index, follow`; staging, admin, thin, and private routes get `metadata.robots` (HTML) or `X-Robots-Tag` (non-HTML, whole environments).
- Duplicates consolidate through `rel="canonical"`, not `noindex`: a `noindex`ed page passes nothing to the canonical. Previews and staging are the case for `noindex`; Vercel sets it on preview URLs automatically but not on a custom domain attached to a non-production branch.
- Thin hubs (empty author, tag, category, pagination pages) stay `noindex` and out of the sitemap until they carry unique content, and no placeholder or lorem page ships indexable.
- Syndicated copies of one story all point at one canonical URL.

## AI crawlers and answer engines

Google needs no special files: AI Overviews and AI Mode run on Googlebot and core ranking, and `nosnippet` or `max-snippet:0` is the only opt-out (it removes the normal snippet too). Everything else is a robots decision per crawler class: search and citation bots (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`) put a site in answers; training bots (`GPTBot`, `ClaudeBot`, `CCBot`) do not; `Google-Extended` and `Applebot-Extended` are usage tokens with no crawler behind them. `llms.txt` costs one route and earns almost nothing measurable. The full table, `robots.ts` rules, Content-Signal, and the Markdown-alternate patterns are in `references/answer-engines.md`.

## Programmatic SEO (pages at scale)

- Validate demand for the pattern before generating pages; `seo-program` supplies the numbers
- Each page needs unique value backed by data it alone has; templated text swaps are doorway pages
- Clean subfolder URLs, hub-and-spoke linking, breadcrumbs everywhere
- Index the strong pages; `noindex` the long tail until a page earns its place, then add a link and index it

## Audit triage order

1. Crawl and index: robots, sitemap, stray `noindex`, canonicals, redirect chains, soft 404s
2. Technical: HTTPS, Core Web Vitals field data, mobile and desktop parity, AI-crawler access through the CDN
3. On-page: title and H1 uniqueness and non-brand lead, extractable answer, internal links, thin pages
4. Orphans: indexable pages with no internal link or sitemap entry; give them a crawl path or `noindex` and drop them

Report in the same order: what blocks indexation first, then on-page and schema gaps, then the single next fix. Twenty equal-weight findings get none of them done. Report length follows what was found, not the section list.

## Gotchas

- `export const revalidate` on `app/sitemap.ts` fails the build once `cacheComponents: true` is on (the `scaffold-nextjs` default). Move the content fetch into a `'use cache'` helper with `cacheLife('hours')` and `cacheTag`, and `revalidateTag(tag, 'max')` from the publish webhook.
- `generateSitemaps()` writes `/product/sitemap/0.xml`, `/product/sitemap/1.xml`, and no index file. List each generated file in `robots.ts` (`sitemap` takes an array) or Google sees only the ones it stumbles on.
- `lastModified: new Date()` on every sitemap row marks the whole site as changed on every deploy; Google then ignores `lastmod` sitewide. `priority` and `changeFrequency` are ignored outright, so emitting them buys nothing and clutters the diff.
- `middleware.ts` is deprecated in Next.js 16. New request-time logic (slug checks, CSP nonces, `Accept` negotiation) goes in `proxy.ts` with an exported `proxy` function; `npx @next/codemod@canary middleware-to-proxy .` moves an existing file.
- `notFound()` after a Suspense boundary or `loading.tsx` has flushed returns 200 with a `noindex` meta, not 404. Call it before the first suspending `await`, or check the slug in `proxy.ts`; analytics and uptime monitors otherwise see a healthy 200 for a missing page.
- `curl -s <url> | rg canonical` on a page with dynamic `generateMetadata` may find the tag in `<body>`, because Next.js streams metadata for non-bot user agents. That is valid for Googlebot. To see the blocking `<head>` form, pass `-A Twitterbot`.
- A nonce CSP forces every page dynamic: no static generation, no ISR, no prerendered shell. Adding it to fix a scanner warning costs the site its cache; use the static `next.config.ts` header unless compliance forbids `'unsafe-inline'`.
- Blocking `GPTBot` to stay out of ChatGPT answers does the opposite of the intent: `GPTBot` is training only, `OAI-SearchBot` is what puts a page in ChatGPT search, and `ChatGPT-User` fetches live when a person asks. Same shape for `ClaudeBot` versus `Claude-SearchBot` and `Claude-User`.
- Disallowing `Google-Extended` does not remove a page from AI Overviews; it only withdraws Gemini training and grounding. The AI Overviews opt-out is `nosnippet` or `max-snippet:0`, and it removes the ordinary snippet too.
- Cloudflare blocks known AI crawlers by default on zones created since July 2025 and prepends its own `Content-Signal` block to `robots.txt`. Check `curl -A OAI-SearchBot` against the live host before editing `robots.ts`; the code can be right and the site still uncitable.
- Vercel omits `X-Robots-Tag: noindex` from a custom domain on a non-production branch. `staging.example.com` indexes unless the `headers()` rule adds it.
- `noindex` plus a canonical to production on a duplicate is self-defeating: Google does not consolidate from a page it is told not to index. Canonical alone for duplicates; `noindex` alone for previews.
- A Lighthouse pass is a lab run on one device. Google assesses the p75 of CrUX field data, and a green Lighthouse score with a failing field assessment is routine. Report both, and name the metric that fails in the field.
- Never invent Search Console coverage counts, crawl stats, or traffic numbers in an audit; the fix lands on the wrong page. Write "no data" and name the missing access.
- Schema the page has not earned (`FAQPage` without visible questions, `Person` with no named author, `Review` with no review) is treated as spam. `FAQPage` lost its rich result on 7 May 2026, so the upside that used to offset that risk is gone.
- Google's Article doc has no required fields and `publisher` is optional. When you include it, make it the Organization with a `logo`; a `Person` publisher fails the Rich Results Test warning check.
- Indexable content moved behind `"use client"` plus a fetch in `useEffect` is invisible to every crawler that does not run JavaScript, which is all the AI agents and the initial Googlebot pass. Server Components already render on the server; this is a regression you introduce.
- Non-reciprocal `hreflang` (one alternate missing from one page) drops the whole set. A canonical pointing across languages drops the localised page.
- `Strict-Transport-Security` with `preload` before every subdomain is HTTPS is effectively irreversible: removal takes months to reach browsers. Ramp `max-age` through 300, 604800, and 2592000 first.
- Google Ads or GA4 tags on EEA/UK traffic without `ad_user_data` and `ad_personalization` consent signals (Consent Mode v2, mandatory since March 2024) silently degrade conversion measurement; the banner can be perfect and the data still wrong.
- A maintenance window served as 200 or 404 gets the site deindexed over a long outage. Return 503 plus `Retry-After`.

## Related skills

- `seo-program`: keyword and prompt-volume research, question maps, writer briefs, Search Console monitoring. It decides what a page should target; this skill builds the page and reports what it shipped.
- `ui-design`: visual direction and landing-page CRO (Direction mode), building the page (Build mode), and page-level UI quality including rendered i18n behaviour (Audit mode). This skill owns `hreflang` and localised metadata.
- `multi-tenant-architecture`: per-tenant routing of `robots.txt`, `sitemap.xml`, and `llms.txt`, which must be served dynamically and never from `/public`. This skill owns their content once routing works.
- `docs-writing`: what a documentation site should list in `llms.txt` and which pages earn a Markdown alternate. This skill owns the route and the crawler policy; that skill owns which docs are worth pointing at.
- `scaffold-nextjs`: hands off here after the first deploy. Its default enables Cache Components, which changes how the sitemap revalidates (see Gotchas).
- `copywriting`: meta descriptions and titles as copy, once this skill has set the keyword lead and length.
- External `ghostwriter` with the blog profile: writes the article.

## Validation (step 5, evidence required)

Copy `references/seo-checklist.md`, mark each line, and attach command evidence:

| Check | Command or source | Expected |
|---|---|---|
| Production build | `npm run build 2>&1 \| tail -20` (or repo equivalent) | exits 0 |
| Response headers | `curl -sI <url>` | correct status, one redirect hop, canonical host |
| Served metadata | `curl -s -A Twitterbot <url> \| rg "canonical\|og:\|twitter:\|application/ld\+json"` | tags present in `<head>` |
| Robots | `curl -s <origin>/robots.txt` | expected allow and disallow, sitemap lines, per-class AI rules, any `Content-Signal` |
| Sitemap | `curl -s <origin>/sitemap.xml \| head -40` | absolute URLs, content-derived `lastmod`, every generated file reachable |
| Missing page | `curl -s -o /dev/null -w '%{http_code}\n' <origin>/definitely-missing` | 404 |
| AI crawler access | `curl -s -o /dev/null -w '%{http_code}\n' -A OAI-SearchBot <url>` (repeat for `Claude-SearchBot`, `PerplexityBot`) | 200 and the body is the page, not a challenge |
| Agent readiness | `npx is-agentic <domain> --json` | score plus failed-check list, before and after |
| Lighthouse | `npx lighthouse <url> --only-categories=seo,performance --output=json --output-path=.lighthouse-seo.json --quiet` | SEO and Performance at or above 90, or blockers listed |
| Core Web Vitals (field) | PageSpeed Insights or the CrUX API for the origin | p75 LCP, INP, CLS in target, or the failing metric named |
| Structured data | Rich Results Test per URL | valid, warnings cleared, unsupported types documented |
| Search Console after deploy | Pages report and enhancement reports | no new warnings; indexed and excluded changes explained |

Report remaining blockers with exact URLs and an owner for each.
