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

## Final Validation
- [ ] Lighthouse SEO score >= 90
- [ ] Lighthouse Performance score >= 90
- [ ] Social sharing previews render correctly
- [ ] Structured data validated per URL
