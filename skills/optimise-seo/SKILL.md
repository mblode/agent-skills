---
name: optimise-seo
description: Optimises SEO, answer-engine readability, and technical foundations for Next.js App Router apps, covering sitemaps, robots, meta tags, structured data, canonical URLs, redirects, indexing policy, llms.txt and AI-crawler policy, hreflang, Core Web Vitals, programmatic SEO, security headers, privacy/consent, and error-page resilience. Use when asked to "improve SEO", "add a sitemap", "fix meta tags", "add structured data", "set canonical URLs", "set up redirects", "fix soft 404s", "add hreflang", "add llms.txt", "add security headers", "add cookie consent", "improve Core Web Vitals", or "audit SEO". Implements in a Next.js App Router codebase; for strategy or a non-Next.js stack prefer seo-audit, programmatic-seo, schema, or ai-seo, and for keyword research, briefs, and Search Console monitoring use seo-program. Performs no visual redesigns; for visual direction or page-level UI quality use ui-design Direction or Audit mode. For writing the article itself use the external ghostwriter skill with platform blog.
---

# Optimise SEO

- **IS:** crawlability, metadata, structured data, canonicals, redirects, hreflang, answer-engine readability (extractable answers, question-shaped headings, `llms.txt`, AI-crawler policy), Core Web Vitals, programmatic SEO, security/privacy headers, and error-page status behaviour for Next.js App Router apps.
- **IS NOT:** visual redesigns or layout changes (use `ui-design` Direction and Build modes), or page-level UI quality review (use `ui-design` Audit mode). This skill implements the answer-engine surfaces; AI-search content tactics and citation strategy belong to `ai-seo`, and demand research, keyword and prompt volumes, writer briefs, and Search Console monitoring belong to `seo-program`.

Allowed surface: metadata, structured data, semantic HTML, internal links, alt text, `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts`, `next.config.ts` redirects and headers, error pages, performance tuning. Never touch component styling or layout.

## Workflow

Copy and track this checklist:

```text
SEO progress:
- [ ] Step 1: Inventory routes and decide index intent per route
- [ ] Step 2: Fix crawl/index foundations (sitemap, robots, canonicals, redirects, status codes)
- [ ] Step 3: Implement metadata + structured data
- [ ] Step 4: Improve semantics, answer-engine readability, internal links, and Core Web Vitals
- [ ] Step 5: Validate with references/seo-checklist.md and report evidence
```

Before writing code for steps 2-4, read [references/nextjs-implementation.md](references/nextjs-implementation.md): App Router patterns (Metadata API, `generateMetadata`, sitemap index, JSON-LD component, OG image generation, `llms.txt` route, AI-crawler rules, `headers()`/`redirects()` config).

## Must-have on every site

- `app/sitemap.ts` lists all public URLs; `app/robots.ts` links to it
- Canonical URL set and consistent on every page (one host, one casing, one trailing-slash policy)
- Unique title and description per page via `metadata` or `generateMetadata`
- Title and H1 both lead with the non-brand primary keyword and match each other in intent; a brand-led title on a page meant to rank for a category term competes only for navigational queries the site already wins
- Every page opens with a short extractable answer to the question it exists to answer, in plain text a search or answer engine can quote
- OpenGraph + Twitter Card tags with a 1200x630 image
- JSON-LD: Organization and WebSite on the homepage, BreadcrumbList on inner pages, plus Article/Product/FAQ where the content type matches. Define each entity once in a `@graph` with a stable `@id` and reference it by `@id` instead of duplicating it inline (`@id` conventions and the per-type code: `references/nextjs-implementation.md`)
- One h1 per page with logical h2-h6 hierarchy
- Descriptive alt text, internal links between related pages, CWV in target at p75 of field data (LCP < 2.5s, INP < 200ms, CLS < 0.1). Thresholds unchanged in 2026; INP replaced FID in March 2024, so any guide still naming FID is stale

## Answer-engine readability

Google needs no special files: its AI features run on core Search ranking, and writing separate content for AI risks the scaled-content-abuse policy. Everything below serves the non-Google engines that reward extractable structure, and none of it hurts Google, because it is ordinary good structure. Facts in this section were checked August 2026; the field moves fast enough that a figure older than a couple of quarters should be re-checked before you spend on it.

**Access: can an agent see real content?** Core content must be in the initial HTML response; most agents never execute JavaScript, so a client-rendered page is an empty page to them. Check what the CDN or WAF actually does to the agents below: default bot protection blocks them on plenty of sites where nobody decided to.

**Discovery: sort agents by what they do before writing a rule.** Blocking the wrong class is the most common self-inflicted wound here.

| Class | Agents | Blocking costs |
|---|---|---|
| Retrieval and citation | `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Bingbot`, `Googlebot` | citations: these are what put you in an answer |
| User-triggered fetch | `ChatGPT-User`, `Claude-User`, `Perplexity-User` | the live fetch when someone asks about you by name |
| Model training | `GPTBot`, `ClaudeBot`, `CCBot`, `Bytespider` | training inclusion, not citations |
| Control tokens, not crawlers | `Google-Extended`, `Applebot-Extended` | nothing is blocked; they govern what Google and Apple may do with content their normal crawlers already fetched |

`llms.txt` at the origin root costs one route and is fine to ship beside the sitemap, but do not book it as a win: no major AI company parses it, Google says it is not required, and Ahrefs found 97% of published `llms.txt` files took zero requests in May 2026. `llms-full.txt` is the same trade. Emerging and worth watching rather than adopting: the IETF AIPREF drafts define a `Content-Usage` robots.txt rule and HTTP header (`Content-Usage: train-ai=n`) so usage preferences come from you instead of being inferred. Still working-group drafts as of August 2026.

**Parseability: can an agent tell what the page is?** The extractable answer goes in the first paragraph, ahead of any preamble. Shape h2s as the questions people ask, evaluator questions first (what it is, when to use it, how it compares, how to do it, what good looks like, real limits). `FAQPage` no longer earns a Google rich result: Google dropped the search appearance on 7 May 2026 and pulled it from the Rich Results Test and the Search Console API over the months after. Keep the markup where the questions render as visible text, because Google still parses it and it correlates with higher citation weighting in ChatGPT, but never add it to a page whose questions are not on screen, since the rich-result upside that used to offset that risk is gone. Optionally serve a Markdown representation at the same canonical URL under `Accept: text/markdown` with a `Vary` header, or advertise a parallel `.md` via a `Link` header.

**Where the leverage actually is.** The 2026 citation studies are vendor research with varying rigour, so treat each figure as a dated snapshot, but they agree on the shape:

- Brand search volume is the strongest published predictor of being cited, ahead of backlinks. That is a demand problem rather than a markup one, and `seo-program` owns it.
- Pages dense with specifics (one study puts the threshold near 19 distinct data points) are cited several times more often than prose-only pages. Numbers, dates, and named comparisons are the extractable unit.
- ChatGPT and Perplexity overlap on roughly a tenth of cited domains, so "AI visibility" is not one target. Name the engine that matters and check it directly.
- Earned third-party placements outrank owned pages for citation rate by a wide margin, which no amount of markup on your own domain substitutes for.

## Programmatic SEO (pages at scale)

- Validate search demand for the pattern before generating pages
- Each page needs unique value backed by defensible data; templated text swaps are doorway pages
- Clean subfolder URLs, hub-and-spoke linking, breadcrumbs on every page
- Index only strong pages; `noindex` the long tail and monitor indexation and cannibalisation in Search Console
- Applies to single pages too: `noindex` a thin page and omit it from the sitemap until it carries unique content, then add an internal link and index it

## SEO audit (triage order)

1. Crawl/index: robots, sitemap, stray `noindex`, canonicals, redirect chains, soft 404s
2. Technical: HTTPS, Core Web Vitals, mobile/desktop parity
3. On-page: titles/H1 uniqueness and non-brand lead, extractable answer, internal links, remove or `noindex` thin pages
4. Orphans: indexable pages (metadata, canonical, breadcrumb) with no internal link or sitemap entry. Either give them a crawl path (nav/footer link plus sitemap) or `noindex` and drop from the sitemap

Report in the same order: what blocks indexation or conflicts with the canonical first, then on-page and schema gaps, then the single next fix. A list of twenty equal-weight findings gets none of them done.

## Redirects and indexing policy

- Permanent moves use 301/308, temporary use 302/307. Never chain; point straight to the final URL.
- A missing page must return a real 404, not 200 with a friendly message: 200-for-missing is a soft 404 and won't index.
- Give every route an explicit index decision: public pages default to `index, follow`; staging, admin, thin, or private routes get `metadata.robots` noindex (HTML) or `X-Robots-Tag` (non-HTML, whole environments).
- Preview, staging, and QA URLs get `noindex` **and** a canonical pointing at the production URL, so a leaked preview link consolidates onto the real page instead of competing with it.
- Thin hubs (empty author, tag, category, or pagination pages) stay `noindex` until they carry unique content of their own.
- Placeholder and lorem pages never ship as indexable URLs.
- When the same story is republished on another host (syndication, a partner blog), pick one canonical URL and point every copy at it.

## Internationalisation (multi-locale sites)

One URL pattern for all locales; reciprocal `hreflang` with self-reference plus `x-default`; translate metadata, not just body; never auto-redirect by IP or `Accept-Language`. Full rules and the `generateMetadata` pattern: [references/internationalisation.md](references/internationalisation.md).

## Technical hardening (security, privacy, resilience)

Security headers (HSTS, CSP, `nosniff`, `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`), SRI, cookie flags, `security.txt`, privacy policy and opt-in consent, correct 404/500/503 behaviour, web app manifest. Read [references/technical-hardening.md](references/technical-hardening.md) for header, cookie, consent, or error-page tasks.

## Gotchas

- Don't over-generate thin or doorway pages: indexation drops and sitewide quality signals suffer.
- Don't let canonicals conflict across variants (trailing slash, www, uppercase): ranking signal splits between duplicates.
- Don't block crawlers via `robots.txt`, `noindex`, or auth walls on routes meant to rank; check before shipping, not after traffic drops.
- Don't move indexable content behind a client-only render (`"use client"` plus a fetch in `useEffect`): the crawler indexes the empty shell, so the page ranks for nothing. Server Components already render on the server, so this is a regression you introduce, not a default to fix.
- Don't change URLs without 301/308 redirects: link equity and crawl budget are lost.
- Don't add schema the page hasn't earned: JSON-LD that doesn't match visible content, `FAQPage` without the questions rendered, or `Person` without a real named author. Google treats decorative markup as spam and may demote the page.
- Don't trust an automated grader's schema verdict over your own check: scanners routinely type a valid JSON-LD `@graph` as unknown and hallucinate entities out of `memberOf` and `sameAs`. Gate on a schema check you control, and use the scanner for the surfaces it can actually see.
- Don't block `GPTBot` expecting to stay out of ChatGPT answers while staying citable: `GPTBot` is the training crawler, and `OAI-SearchBot` plus `ChatGPT-User` are what reach a live answer. Blocking the wrong one of the three gets you the opposite of the intent.
- Don't read a Lighthouse run as a Core Web Vitals pass: Lighthouse is a lab simulation and Google assesses the p75 of real field data in CrUX. A green lab score and a failing field assessment coexist routinely.
- Don't let bot protection decide your AI-crawler policy: a WAF that challenges `GPTBot` or `ClaudeBot` by default makes the site uncitable, and nothing in the codebase records that anyone chose it.
- Don't invent Search Console coverage counts, crawl stats, or traffic numbers in an audit: the fix lands on the wrong page. Write "no data" and name the access that is missing.
- Don't ship `hreflang` that isn't reciprocal across every alternate; search engines ignore non-mutual sets.
- Don't serve a maintenance window with 200 or 404: return 503 + `Retry-After` so the site isn't deindexed.
- Don't add `Strict-Transport-Security` with `preload`/`includeSubDomains` before every subdomain is HTTPS; it's effectively irreversible.
- Don't set `Person` as `publisher` on articles: rich results expect an `Organization` publisher with a `logo`. Keep `Person` as `author`.
- Don't stop at required schema fields: Search Console flags missing recommended fields as rich-result warnings. Clear warnings, not just errors (per-type field lists: `references/nextjs-implementation.md`).
- Don't hardcode the sitemap `lastModified`: it goes stale and signals dead content. Derive it from the most recent content date.
- Don't leave indexable pages orphaned: no internal link wastes crawl equity and the page may never be discovered or ranked.

## References

- [references/nextjs-implementation.md](references/nextjs-implementation.md): App Router code patterns; read before steps 2-4
- [references/internationalisation.md](references/internationalisation.md): URL strategy, hreflang, localised metadata; read for multi-locale sites
- [references/technical-hardening.md](references/technical-hardening.md): security headers, privacy/consent, resilience; read for hardening tasks
- [references/seo-checklist.md](references/seo-checklist.md): pass/fail validation checklist; copy during step 5

## Related skills

- `ai-seo`: AI-search content tactics and citation strategy. It decides what to say to get cited; this skill ships the markup, `llms.txt`, and crawler rules that make the page liftable.
- `seo-program`: keyword and prompt-volume research, writer briefs, AEO question maps, and Search Console monitoring. It decides what a page should target; this skill builds the page.
- `ui-design` Direction mode: visual direction, palettes, typography, landing-page CRO
- `ui-design` Audit mode: page-level UI quality and rendered i18n behavior (locale formatting, plurals, RTL); `optimise-seo` owns hreflang and localized metadata
- `multi-tenant-architecture`: per-tenant routing and custom domains. It owns the constraint that `robots.txt`, `sitemap.xml`, and `llms.txt` vary by tenant and never come from `/public`; this skill owns their content once routing works.

## Validation (step 5, evidence required)

Copy [references/seo-checklist.md](references/seo-checklist.md), mark every item pass/fail, then attach command evidence:

| Check | Command/source | Expected result |
|---|---|---|
| Production build | `npm run build` or repo equivalent | exits 0 |
| Response headers | `curl -sI <url>` | correct status, redirects, canonical host |
| Served HTML metadata | `curl -s <url> \| rg "canonical\|og:\|twitter:\|application/ld\+json"` | tags present in source |
| Robots | `curl -s <origin>/robots.txt` | expected allow/disallow, sitemap, explicit AI-crawler rules |
| Sitemap | `curl -s <origin>/sitemap.xml` | indexed routes, absolute URLs, fresh `lastmod` when used |
| llms.txt | `curl -s <origin>/llms.txt` | resolves, lists live canonical URLs |
| AI crawler access | `curl -s -o /dev/null -w '%{http_code}\n' -A GPTBot <url>` (repeat for ClaudeBot, PerplexityBot) | 200, and the body is the page rather than a challenge interstitial |
| Agent readiness | `npx is-agentic <domain>` | score plus failed-check worklist, captured before and after |
| Lighthouse | `npx lighthouse <url> --only-categories=seo,performance --output=json --output-path=.lighthouse-seo.json` | SEO and Performance >= 90, or blockers listed |
| Core Web Vitals (field) | PageSpeed Insights or the CrUX API for the origin | p75 LCP/INP/CLS in target, or the failing metric named |
| JSON-LD | Google Rich Results Test URL/result | valid or documented unsupported schema (`FAQPage` no longer listed there) |
| Search Console after deploy | Pages/Coverage and enhancement reports | no new warnings; indexed/excluded changes explained |

Report remaining blockers with exact URLs and owner/action.
