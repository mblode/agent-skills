# SEO Checklist

Copy this checklist and check off items as you complete them.

## Crawl & Index
- [ ] `app/sitemap.ts` lists all public URLs
- [ ] `app/robots.ts` allows crawlers, links to sitemap
- [ ] No unintended `noindex` on public pages
- [ ] Canonical URL set and consistent on every page

## Meta Tags
- [ ] Unique title (50-60 chars) per page
- [ ] Unique description (150-160 chars) per page
- [ ] OpenGraph: type, url, title, description, image (1200x630)
- [ ] Twitter: card, title, description, image
- [ ] Favicons: favicon.ico, icon.svg, apple-touch-icon.png

## Structured Data
- [ ] Organization + WebSite schemas on homepage
- [ ] BreadcrumbList on all non-homepage pages
- [ ] Article/Product/FAQ schemas where applicable
- [ ] Passes Google Rich Results Test

## Content & Semantics
- [ ] Single h1 per page with logical h2-h6 hierarchy
- [ ] Descriptive alt text on all images
- [ ] Internal links between related pages

## Core Web Vitals
- [ ] LCP < 2.5s (hero image uses `priority`)
- [ ] INP < 200ms
- [ ] CLS < 0.1 (images have width/height)
- [ ] TTFB < 600ms

## Redirects & Status
- [ ] Moved URLs return 301/308 (permanent), not 302/307; no redirect chains
- [ ] Missing pages return real 404 (no soft 404s returning 200)
- [ ] Staging/admin/thin pages have explicit `noindex` / `X-Robots-Tag`

## Internationalisation (multi-locale only)
- [ ] One URL pattern for all locales (subdir / subdomain / ccTLD)
- [ ] `hreflang` reciprocal across all alternates, with self-ref + `x-default`
- [ ] Metadata translated (title, description, OG, JSON-LD, alt), not just body
- [ ] No automatic IP/Accept-Language locale redirects

## Security headers
- [ ] HTTPS enforced; HTTP→HTTPS redirect; HSTS set
- [ ] `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `frame-ancestors`
- [ ] `Referrer-Policy` and `Permissions-Policy` set
- [ ] Third-party scripts use Subresource Integrity; cookies `Secure`/`HttpOnly`/`SameSite`
- [ ] `/.well-known/security.txt` published

## Privacy
- [ ] Privacy policy present and accurate
- [ ] Non-essential cookies gated behind opt-in consent (EU/UK)
- [ ] Global Privacy Control signal honoured
- [ ] Analytics is cookieless/aggregate where possible; data minimised

## Resilience
- [ ] Custom 404/500 return correct status codes, no leaked stack traces
- [ ] Maintenance returns 503 + `Retry-After`
- [ ] Web app manifest present
- [ ] Uptime monitored from outside own infra

## Final Validation
- [ ] Lighthouse SEO score >= 90
- [ ] Lighthouse Performance score >= 90
- [ ] Social sharing previews render correctly
- [ ] Structured data validated per URL
