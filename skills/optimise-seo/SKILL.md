---
name: optimise-seo
description: Implements SEO and technical foundations in Next.js App Router codebases, covering sitemap and robots metadata routes, generateMetadata titles and canonicals, JSON-LD structured data, 308/307 redirects, indexing policy and soft-404 status codes, hreflang, Core Web Vitals, AI-crawler policy (per-crawler robots rules, llms.txt, Content-Signal), programmatic SEO, security headers, consent, and error-page resilience. Use when asked to "improve SEO", "add a sitemap", "fix meta tags", "add structured data", "set canonical URLs", "set up redirects", "fix soft 404s", "add hreflang", "add llms.txt", "block GPTBot", "add security headers", "add cookie consent", "improve Core Web Vitals", "audit SEO", or "build SEO pages at scale". Ships code, not strategy. For keyword research, briefs, and Search Console monitoring use seo-program; for visual direction or UI quality use ui-design; for per-tenant robots and sitemap routing use multi-tenant-architecture; for the article itself use the external ghostwriter skill.
---

# Optimise SEO

- **IS:** crawlability, metadata, structured data, canonicals, redirects, status codes, hreflang, AI-crawler policy and extractable page structure, Core Web Vitals, programmatic SEO, security and privacy headers, and error-page behaviour, implemented in a Next.js App Router codebase.
- **IS NOT:** visual redesign, layout, or page-level UI quality (`ui-design` Direction, Build, and Audit modes), demand research, briefs, question maps, or Search Console monitoring (`seo-program`), tenant routing for `robots.txt` and `sitemap.xml` (`multi-tenant-architecture`), or writing the article (external `ghostwriter`).

Allowed surface: `metadata` and `generateMetadata`, JSON-LD, semantic HTML, internal links, alt text, `app/sitemap.ts`, `app/robots.ts`, `app/feed.xml/route.ts`, `app/llms.txt/route.ts`, `proxy.ts`, `next.config.ts` redirects and headers, error pages, and performance work. Component styling and layout stay as they are; when a fix needs a layout change, name it as a handoff to `ui-design`.

Before writing code, read the matching guide in `node_modules/next/dist/docs/` (resolved from the app directory; in a monorepo the `next` package is not visible from the repo root). The bundled docs match the installed version; the notes in `references/nextjs-implementation.md` were checked against 16.3 and say where behaviour changed.

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
- One canonical per page, one host, one casing, one trailing-slash policy, set through `alternates.canonical` with `metadataBase` in the root layout. Next.js enforces the slash policy itself: by default it 308s `/about/` to `/about`, and `trailingSlash: true` inverts that (files with extensions and `.well-known/` paths are exempt either way)
- `metadata.verification` carries the Search Console, Bing, and Yandex tokens so ownership does not depend on a DNS record someone else controls
- Root layout `robots` lifts Google's default preview caps: `googleBot: { 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 }`. Without them Google truncates the snippet and the image preview, and the snippet cap is what AI surfaces read against when deciding how much of a page they may quote
- `authors` and `creator` set explicitly in the root layout, so person-level attribution does not live only in footer HTML and JSON-LD
- Unique title and description per page; title and H1 lead with the non-brand primary keyword and agree in intent (a brand-led title on a category page competes only for navigational queries the site already wins)
- Every page opens with a short, plain-text answer to the question it exists to answer; the h2s are the questions people actually ask
- Open Graph and Twitter Card tags with a 1200x630 image
- JSON-LD: Organization and WebSite once in a root `@graph` with stable `@id`s, BreadcrumbList on inner pages, then Article, Product, ProfilePage, or LocalBusiness where the content type matches. Define an entity once and reference it by `@id`
- One h1, logical h2-h6, descriptive alt text, internal links between related pages
- Core Web Vitals in target at the p75 of CrUX field data: LCP 2.5 s, INP 200 ms, CLS 0.1 (INP replaced FID in March 2024; a guide still naming FID is stale)

## Redirects and indexing policy

- Permanent moves are 308 (`permanent: true`, `permanentRedirect()`); temporary are 307. One hop, straight to the final URL, and set at one layer (edge or `next.config.ts`, not both).
- A missing page returns a real 404. In the App Router that means the existence check runs before anything streams; otherwise the response is 200 plus a `noindex` meta, which Search Console reports as a soft 404. Under Cache Components every dynamic route streams its shell first, so the check lives in `proxy.ts`, not in the page.
- Every route has an explicit index decision. Public pages are `index, follow`; staging, admin, thin, and private routes get `metadata.robots` (HTML) or `X-Robots-Tag` (non-HTML, whole environments).
- Duplicates consolidate through `rel="canonical"`, not `noindex`: a `noindex`ed page passes nothing to the canonical. Previews and staging are the case for `noindex`; Vercel sets it on preview URLs automatically but not on a custom domain attached to a non-production branch.
- Thin hubs (empty author, tag, category, pagination pages) stay `noindex` and out of the sitemap until they carry unique content, and no placeholder or lorem page ships indexable.
- Syndicated copies of one story all point at one canonical URL. Publish on the origin first, wait until Search Console shows it indexed, then syndicate; a platform copy that goes live first outranks the origin even with the canonical set later.

## AI crawlers and answer engines

Google needs no special files: AI Overviews and AI Mode run on Googlebot and core ranking, and `nosnippet` or `max-snippet:0` is the only opt-out (it removes the normal snippet too). Everything else is a robots decision per crawler class: search and citation bots (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`) put a site in answers; training bots (`GPTBot`, `ClaudeBot`, `CCBot`) do not; `Google-Extended` and `Applebot-Extended` are usage tokens with no crawler behind them. `llms.txt` costs one route and earns almost nothing measurable. The full table, `robots.ts` rules, Content-Signal, and the Markdown-alternate patterns are in `references/answer-engines.md`.

## Programmatic SEO (pages at scale)

- Validate demand for the pattern before generating pages; `seo-program` supplies the numbers
- Each page needs unique value backed by data it alone has; templated text swaps are doorway pages
- Clean subfolder URLs, hub-and-spoke linking, breadcrumbs everywhere
- Index the strong pages; `noindex` the long tail until a page earns its place, then add a link and index it
- Under Cache Components, `generateStaticParams` must return at least one param (an empty array raises `empty-generate-static-params`). List the strong pages there; unlisted slugs get the App Shell on first visit and are upgraded in the background, which needs `partialPrefetching: true`

## Audit triage order

1. Crawl and index: robots, sitemap, stray `noindex`, canonicals, redirect chains, soft 404s
2. Technical: HTTPS, Core Web Vitals field data, mobile and desktop parity, AI-crawler access through the CDN
3. On-page: title and H1 uniqueness and non-brand lead, extractable answer, internal links, thin pages
4. Orphans: indexable pages with no internal link or sitemap entry; give them a crawl path or `noindex` and drop them. A sitewide footer link is not a crawl path on a low-authority domain: Google discounts footer boilerplate, and a section linked only from the footer can sit at "URL is unknown to Google" for months while nav-linked pages beside it are crawled daily

Report in the same order: what blocks indexation first, then on-page and schema gaps, then the single next fix. Twenty equal-weight findings get none of them done. Report length follows what was found, not the section list. Treat third-party audit tools as leads, not findings: several flag Next.js output falsely (a missing `<meta name="title">` when `<title>` is present, "duplicate" `theme-color` tags that are light and dark variants, repeated `article:tag`), and at least one agent-skill auditor silently skips modules unless given an explicit module list and passes a `FAQPage` whose answers never render. Verify each lead against the served HTML before it goes in the report.

## Gotchas

- Under `cacheComponents: true` (the `scaffold-nextjs` default) the `dynamic`, `dynamicParams`, `revalidate`, and `fetchCache` segment configs are build errors: `export const revalidate` on `app/sitemap.ts`, `dynamic = 'force-static'` on a `robots.txt/route.ts` handler, `fetchCache` anywhere (`runtime`, `maxDuration`, `instant`, and `prefetch` remain valid). Move the content fetch into a separate `'use cache'` helper with `cacheLife('hours')` and `cacheTag`, called from the page or `GET` (the directive cannot sit on the `GET` export itself), and `revalidateTag(tag, 'max')` from the publish webhook. Revalidation does not purge a CDN in front of the app; purge it in the same webhook.
- `generateSitemaps()` writes `/product/sitemap/0.xml`, `/product/sitemap/1.xml`, and no index file. List each generated file in `robots.ts` (`sitemap` takes an array) or hand-write the index at `app/sitemap.xml/route.ts`; otherwise Google sees only the ones it stumbles on.
- `lastModified: new Date()` on every sitemap row marks the whole site as changed on every deploy; Google then ignores `lastmod` sitewide. `priority` and `changeFrequency` are ignored outright, so emitting them buys nothing and clutters the diff.
- No `Host:` line in `robots.txt`. Yandex dropped the directive in 2018 in favour of a 301 to the preferred host, which `next.config.ts` already serves, and auditors flag the leftover line as an unknown directive. Leave `host` out of the `robots.ts` return value.
- Next.js replaces object-valued metadata (`openGraph`, `twitter`, `robots`, `alternates`) wholesale when a child segment declares the key; it does not deep-merge. A page that adds `openGraph: { title }` loses the inherited `siteName`, `images`, and `locale`, and `images: undefined` counts as a declaration. When you add one of these blocks to a route, every field the parent supplied becomes yours to restate. Scalars (`title`, `description`, `authors`, `creator`) merge normally.
- `title.template` applies to `<title>` only. `og:title` resolves against `openGraph.title.template`, a separate mechanism, so stripping a hand-rolled suffix from a page title silently strips the product name from the share card. Set both templates in the layout, or neither. A bare string `title` in a nested layout also resets the parent template to null for that subtree; return `{ default, template }` instead.
- Never set `openGraph.url` in a root layout. It is not per-page, every route inherits it, and every share collapses onto the home URL. A child cannot fix it without declaring `openGraph` and losing the rest of the block. Absent beats wrong: consumers fall back to the URL they fetched, and `alternates.canonical` is already per-page.
- `middleware.ts` is deprecated in Next.js 16. New request-time logic (slug checks, CSP nonces, `Accept` negotiation) goes in `proxy.ts` with an exported `proxy` function; `npx @next/codemod@canary middleware-to-proxy .` moves an existing file. Proxy is Node.js only; `runtime` is not a valid export there.
- `next.config.ts` redirects match in array order and `:path*` swallows everything beneath it, so a specific source placed after a catch-all is dead code, and a bare `/old` must sit above `/old/:path*` or it lands on `/new/`. Vercel caps the list at 1,024 rules; past that, move the map into `proxy.ts`.
- Next owns the `Vary` header on App Router HTML responses and replaces it with its RSC list (`rsc, next-router-state-tree, ...`). A `Vary: Accept` set in `proxy.ts` on `NextResponse.next()`, or in `headers()`, never reaches the client. It survives only on a `Response` you construct yourself, so content-negotiated Markdown must be returned directly, not rewritten to.
- `notFound()` after a Suspense boundary or `loading.tsx` has flushed returns 200 with a `noindex` meta, not 404. Without Cache Components, call it before the first suspending `await`; with Cache Components the docs are explicit that every dynamic route streams a static shell first, so the existence check moves to `proxy.ts`. Analytics and uptime monitors otherwise see a healthy 200 for a missing page. The `noindex` meta on a real 404 is injected by Next.js automatically, including on `global-not-found`, so adding `robots` to the 404 page changes nothing.
- `redirect()` and `permanentRedirect()` called once streaming has started emit a client-side `<meta>` redirect on a 200, not a 307 or 308. A moved slug handled inside a page under Cache Components ships as 200 plus meta refresh; permanent moves belong in `next.config.ts` or Proxy.
- HTML-limited bots (`Twitterbot`, `Bingbot`, `facebookexternalhit`, and Next's default list) skip the prerendered shell and get the whole page rendered dynamically at request time. Anything the shell reads only at build time (an `fs` read that is absent in the deployed function, a build-time env var) can fail for a crawler while the page loads for a person. `curl -A Twitterbot` exercises that path; run it on every route that touches the filesystem.
- `curl -s <url> | rg canonical` on a page with dynamic `generateMetadata` may find the tag in `<body>`, because Next.js streams metadata for non-bot user agents. That is valid for Googlebot. To see the blocking `<head>` form, pass `-A Twitterbot`.
- A nonce CSP forces every page dynamic: no static generation, no ISR, no prerendered shell, and Partial Prerendering is incompatible with it outright. Adding it to fix a scanner warning costs the site its cache; use the static `next.config.ts` header unless compliance forbids `'unsafe-inline'`.
- `Cross-Origin-Resource-Policy: same-origin` on a catch-all `headers()` rule blocks the OG image for every social scraper, which fetches it cross-origin. Add a later rule for `/opengraph-image` setting `cross-origin`; per header key, the last matching rule wins.
- `app/opengraph-image.tsx` serves at `/opengraph-image`, not `/opengraph-image.png`. Hardcoding the extension in `openGraph.images` produces a dead card whose markup looks right. Under a `basePath`, Next prefixes a static `app/opengraph-image.png` with the base path and a generated `.tsx` route not at all, so a `metadataBase` that includes the base path doubles the prefix on the PNG form (`/glide/glide/opengraph-image.png`) and is correct on the generated form. Read the emitted `og:image` out of `next build` output, never `next dev`, which rewrites `metadataBase` to the dev origin.
- The documented home for `.well-known` discovery files is a route handler at `app/.well-known/<name>/route.ts`; `trailingSlash` also exempts everything under `.well-known/`. What does not work: serving them from `public/.well-known/` (dotfiles are dropped by the static pipeline) or reaching a single-segment dotted path such as `/.well-known/mcp.json` through a `next.config.ts` rewrite, which one 16.x deployment found answered with a prerendered 404 while the two-segment `/.well-known/mcp/server-card.json` rewrote fine. If a rewrite is unavoidable, do it in `proxy.ts` with the literal path in the matcher.
- Proxy matchers are anchored at both ends. A bare `/about` entry matches `/about` and nothing beneath it, and `/writing/:slug` matches one segment; the docs' matcher page says `/about` also matches `/about/team`, but the regex `getMiddlewareMatchers` compiles in 16.3.0 ends in `[\/#\?]?$`. List every negotiable path, or use `:path*`.
- Route handlers that are statically prerendered (`sitemap.ts`, `robots.ts`, `llms.txt`) run at build time and again only when their cache revalidates, so an analytics capture inside one fires once per deploy. Per-request capture belongs in `proxy.ts` behind `event.waitUntil()` or `after()`. And a `try/catch` in a `GET` handler catches the prerender bail-out too; set `experimental.hideLogsAfterAbort: true` or every cached handler logs a stack trace during the build.
- `next/image` deprecated `priority` in 16 in favour of `preload`; for the LCP hero the docs prefer `loading="eager"` or `fetchPriority="high"` and reserve `preload` for the one image that must start before the HTML finishes parsing. Keep the LCP element outside or above every `<Suspense>` boundary, size skeletons to the content they replace, and send field data through `useReportWebVitals` from a tiny client component.
- Blocking `GPTBot` to stay out of ChatGPT answers does the opposite of the intent: `GPTBot` is training only, `OAI-SearchBot` is what puts a page in ChatGPT search, and `ChatGPT-User` fetches live when a person asks. Same shape for `ClaudeBot` versus `Claude-SearchBot` and `Claude-User`.
- Disallowing `Google-Extended` does not remove a page from AI Overviews; it only withdraws Gemini training and grounding. The AI Overviews opt-out is `nosnippet` or `max-snippet:0`, and it removes the ordinary snippet too.
- Cloudflare blocks known AI crawlers by default on zones created since July 2025 and prepends its own `Content-Signal` block to `robots.txt`. Check `curl -A OAI-SearchBot` against the live host before editing `robots.ts`; the code can be right and the site still uncitable.
- Vercel omits `X-Robots-Tag: noindex` from a custom domain on a non-production branch. `staging.example.com` indexes unless the `headers()` rule adds it.
- `noindex` plus a canonical to production on a duplicate is self-defeating: Google does not consolidate from a page it is told not to index. Canonical alone for duplicates; `noindex` alone for previews.
- A Lighthouse pass is a lab run on one device. Google assesses the p75 of CrUX field data, and a green Lighthouse score with a failing field assessment is routine. Report both, and name the metric that fails in the field.
- Never invent Search Console coverage counts, crawl stats, or traffic numbers in an audit; the fix lands on the wrong page. Write "no data" and name the missing access.
- Schema the page has not earned (`FAQPage` without visible questions, `Person` with no named author, `Review` with no review) is treated as spam. `FAQPage` lost its rich result on 7 May 2026, so the upside that used to offset that risk is gone. Every claim in JSON-LD must be verifiable in the served DOM: a FAQ whose answers never render, or a `BreadcrumbList` naming a crumb the visible trail does not show, is a structured-data policy violation, and answer engines quote the DOM, not the script. Check built HTML, not the source; a substring test for `"@type":"FAQPage"` passes the broken page.
- `JSON.stringify` does not escape `<`. Replace it with the `\u003c` escape in the JSON-LD serialiser every time, as the Next.js JSON-LD guide does; deciding case by case whether a field could carry HTML is how a later content change turns into script injection.
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
| Response headers | `curl -sI <url>` | correct status, canonical host, no `x-powered-by` |
| Redirects | `curl -sIL <old-url> \| grep -Ei "^(HTTP/\|location:)"` for every rule and every alternate host | exactly one 308 then a 200; no chain, no 404 destination |
| Local production check | `next build && next start`, after `lsof -ti :3000 \| xargs kill` | a fresh server; `next start` on a taken port fails silently while the old build keeps answering |
| Served metadata | `curl -s -A Twitterbot <url> \| rg "canonical\|og:\|twitter:\|application/ld\+json"` | tags present in `<head>` |
| Robots | `curl -s <origin>/robots.txt` | expected allow and disallow, sitemap lines, per-class AI rules, any `Content-Signal` |
| Sitemap | `curl -s <origin>/sitemap.xml \| head -40` | absolute URLs, content-derived `lastmod`, every generated file reachable |
| Missing page | `curl -s -o /dev/null -w '%{http_code}\n' <origin>/definitely-missing` | 404 |
| AI crawler access | `curl -s -o /dev/null -w '%{http_code}\n' -A OAI-SearchBot <url>` (repeat for `Claude-SearchBot`, `PerplexityBot`) | 200 and the body is the page, not a challenge |
| Agent readiness | `npx is-agentic <domain> --json` | score plus failed-check list, before and after |
| Lighthouse | `npx lighthouse <url> --only-categories=seo,performance --output=json --output-path=.lighthouse-seo.json --quiet` | SEO and Performance at or above 90, or blockers listed |
| Core Web Vitals (field) | PageSpeed Insights or the CrUX API for the origin | p75 LCP, INP, CLS in target, or the failing metric named |
| Structured data | Rich Results Test per URL | valid, warnings cleared, unsupported types documented |
| Schema versus DOM | `curl -s <url>`, then compare every JSON-LD `name`, `text`, `headline`, and breadcrumb label against the rendered HTML with `script`, `style`, and `template` stripped. Compare word sequences after decoding entities and removing React's `<!-- -->` markers, not raw strings: the JSON holds the literal character and the HTML holds the entity, and `{a}{b}` ships as `free<!-- -->dom` | every claim visible on the page; exactly one `application/ld+json` block per page (count `<script` tags, not string occurrences: the RSC payload repeats the escaped string) |
| Metadata merge | `curl -s -A Twitterbot <inner-route> \| rg "og:site_name\|og:image\|twitter:creator"` on three inner routes sampled from the sitemap, not the home page | fields inherited from the root layout still present on routes that declare their own `openGraph` or `twitter` |
| Search Console after deploy | Pages report and enhancement reports | no new warnings; indexed and excluded changes explained. "Excluded by noindex" on Markdown twins, "Blocked by robots.txt" on disallowed paths, and "Discovered, currently not indexed" on new pages are expected states, not defects |

Report remaining blockers with exact URLs and an owner for each.
