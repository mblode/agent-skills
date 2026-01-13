# SEO Checklist

High-impact items only.

## Technical
- [ ] Generate `app/sitemap.ts` with all public URLs
- [ ] Create `app/robots.ts` allowing crawlers
- [ ] HTTPS enforced (HTTP → HTTPS redirect)
- [ ] Viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] Mobile-friendly (no horizontal scroll, touch targets >= 44px)

## Meta Tags
- [ ] Unique title (50-60 chars) on every page
- [ ] Unique description (150-160 chars) on every page
- [ ] Canonical URL on every page
- [ ] OpenGraph: type, url, title, description, image (1200x630)
- [ ] Twitter: card, title, description, image (1200x675)
- [ ] Icons: favicon.ico, icon.svg, apple-touch-icon.png

## Structured Data
- [ ] Organization schema on homepage
- [ ] WebSite schema on homepage
- [ ] BreadcrumbList on all non-homepage pages
- [ ] Article schema on blog posts
- [ ] Product schema on product pages
- [ ] Validate with Google Rich Results Test

## Content
- [ ] Single h1 per page
- [ ] Logical h2-h6 hierarchy
- [ ] Descriptive alt text on all images
- [ ] Semantic HTML: header, nav, main, article, footer
- [ ] Descriptive URLs (lowercase, hyphenated)

## Core Web Vitals
- [ ] LCP < 2.5s (optimise hero image, use `priority`)
- [ ] INP < 200ms (minimise JS)
- [ ] CLS < 0.1 (set image width/height)
- [ ] TTFB < 600ms (use CDN, enable compression)

## Images
- [ ] All images have alt text
- [ ] Set width and height attributes
- [ ] Use `next/image` with priority on LCP image
- [ ] Lazy-load below-fold images

## Validation
- [ ] Run Lighthouse: `lighthouse https://site.com --output=json`
- [ ] SEO score >= 90
- [ ] Performance score >= 90
- [ ] Submit sitemap to Google Search Console
- [ ] Test with Google Mobile-Friendly Test

## Launch
- [ ] Remove `noindex` from public pages
- [ ] Verify robots.txt allows indexing
- [ ] Test social sharing (Facebook, Twitter)
- [ ] Validate structured data
- [ ] Set up Google Analytics & Search Console
