# SEO Checklist

Copy this into the report during step 5 and mark each line pass, fail, or n/a with the evidence beside it. Drop sections that do not apply (single-locale sites skip Internationalisation); do not pad them.

## Crawl and index

- [ ] `app/sitemap.ts` lists every indexable URL, absolute, with `lastModified` derived from content
- [ ] `app/robots.ts` allows search crawlers and names the sitemap (every generated file when `generateSitemaps` is used)
- [ ] No unintended `noindex` or `X-Robots-Tag` on public pages; staging and custom-domain previews carry one
- [ ] Canonical set on every page; one host, one casing, one trailing-slash policy; duplicates consolidate via canonical, not `noindex`
- [ ] Every indexable page has an internal-link crawl path (no orphans); sections that matter are linked from the primary navigation, not only the sitewide footer, which Google discounts
- [ ] Redirect destinations answer 200; no rule lands on a 404 or chains (`curl -sIL` shows one 308 then 200)
- [ ] Thin hubs (empty author, tag, category, pagination) and placeholder pages are `noindex` and out of the sitemap
- [ ] Syndicated copies point at one canonical URL

## Redirects and status codes

- [ ] Moved URLs return 308 (or 301) with no chains; temporary moves 307
- [ ] Missing pages return a real 404: `notFound()` runs before streaming starts, or `proxy.ts` handles the miss
- [ ] Maintenance returns 503 plus `Retry-After`

## Metadata

- [ ] `metadataBase` set once; unique title and description per page; home title is `title.absolute` at 50 to 60 characters and inner titles stay at or under 44 before the template suffix
- [ ] `metadata.verification` carries the Search Console and Bing tokens; `trailingSlash` policy is deliberate
- [ ] Root `robots` lifts the Google preview caps (`max-snippet: -1`, `max-image-preview: large`, `max-video-preview: -1`); `authors` and `creator` set
- [ ] Title and H1 lead with the non-brand primary keyword and agree in intent
- [ ] Open Graph type, title, description, image (1200x630, with alt); Twitter card; no `openGraph.url` in the root layout
- [ ] Inner routes that declare their own `openGraph` or `twitter` still carry `og:site_name`, `og:image`, and `twitter:creator` (read three sampled routes from built HTML)
- [ ] Favicons: `icon.svg`, `apple-icon.png`, `favicon.ico`

## Structured data

- [ ] Organization and WebSite in a root `@graph` with stable `@id`s; BreadcrumbList on inner pages
- [ ] Article, Product, ProfilePage, or LocalBusiness only where the page type earns them; nothing decorative
- [ ] `FAQPage` only where the questions render as visible text (no Google rich result since May 2026)
- [ ] Every JSON-LD claim is visible in the served DOM; one `application/ld+json` script per page; breadcrumb list matches the rendered trail
- [ ] `<` escaped as `\u003c` in the serialiser
- [ ] Recommended fields filled; Rich Results Test warnings cleared, not only errors

## Content and semantics

- [ ] One h1; logical h2-h6; h2s shaped as the questions people ask
- [ ] Page opens with a short extractable answer to its main question, then specifics (numbers, dates, comparisons)
- [ ] Descriptive alt text; internal links between related pages; no `rel="nofollow"` on an internal link or CTA
- [ ] Core content in the initial HTML response, not behind a client-only fetch

## AI crawlers

- [ ] CDN or WAF does not challenge `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, or the user-triggered agents (`curl -A` per agent returns the page, not an interstitial)
- [ ] `robots.ts` has one explicit rule per class; training access (`GPTBot`, `ClaudeBot`, `CCBot`) is a recorded decision; no `Host:` line
- [ ] `Content-Signal` line present only when a value is `no`, otherwise knowingly omitted; `llms.txt` served if cheap and not counted as a result
- [ ] Markdown twins (`.md` URLs, `Accept: text/markdown`) carry `X-Robots-Tag: noindex` and `Vary: Accept` on the Markdown response itself
- [ ] IndexNow key served and the submit list derived from the sitemap source, with no redirecting URLs (Bing and Yandex only; optional)

## Core Web Vitals (field data, p75)

- [ ] LCP under 2.5 s (hero image uses `loading="eager"` or `fetchPriority="high"`, not the deprecated `priority`; correct `sizes`; LCP element outside every `<Suspense>` boundary)
- [ ] INP under 200 ms
- [ ] CLS under 0.1 (every image and embed has dimensions; fonts use `next/font` with `display: 'swap'`, a same-class `adjustFontFallback`, and `preload` only on the family the first paint uses; skeletons sized to their content)
- [ ] TTFB under 800 ms
- [ ] No oversized `public/` images

## Internationalisation (multi-locale only)

- [ ] One URL pattern for all locales
- [ ] `hreflang` reciprocal with self-reference and `x-default`, in one location only
- [ ] Canonical of each localised page is itself, not the source language
- [ ] Title, description, OG, JSON-LD, and alt translated
- [ ] No IP or `Accept-Language` redirects

## Security and privacy

- [ ] HTTPS enforced; HSTS set (preload only after the ramp)
- [ ] CSP, `nosniff`, `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy` present; `x-powered-by` absent
- [ ] Third-party scripts carry SRI; cookies `Secure`, `HttpOnly`, `SameSite`
- [ ] `/.well-known/security.txt` published and unexpired
- [ ] Non-essential cookies gated behind opt-in consent (EU/UK); Consent Mode v2 signals set where Google tags run; GPC honoured

## Final validation

- [ ] Lighthouse SEO and Performance at or above 90, or blockers named
- [ ] CrUX p75 in target, or the failing metric named
- [ ] Social previews render; structured data validated per URL
- [ ] Post-deploy: Search Console Pages report and enhancement reports show no new warnings; expected exclusions ("Excluded by noindex" on Markdown twins and utility pages, "Blocked by robots.txt" on disallowed paths, "Discovered, currently not indexed" on new pages) are explained, not chased
