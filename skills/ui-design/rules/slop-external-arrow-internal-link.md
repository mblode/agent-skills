---
title: External-link arrow on a link that stays on the site
id: slop-external-arrow-internal-link
category: slop
defaultTier: backlog
detect: static
related: nav-semantic-links, slop-decoration-no-role
---

## External-link arrow on a link that stays on the site

"Try Northwind ↗" links to `#pricing`. The north-east arrow has one widely learned meaning: this opens somewhere else, often in a new tab. A visitor who reads it hesitates before clicking (will I lose my place?), and when the click only scrolls down the same page, the icon has lied about the one thing it exists to say. Used as a generic "go" glyph on buttons and in-page anchors, it also stops working on the links that really are external, because the reader can no longer trust it.

A plain arrow (→) or no glyph is the right mark for moving forward on the same site. The diagonal arrow belongs to off-site links.

## Detection

Find a north-east arrow glyph or external-link icon inside a `<button>`, or inside a link whose `href` is an in-page anchor or a site-relative path and that has no `target="_blank"`.

```bash
rg -nUP '<(?:(?:a|Link)\b(?![^>]*target="_blank")(?:=>|[^>])*\bhref="(?:#|/(?!/))[^"]*"|button\b)(?:=>|[^>])*>(?:(?!</(?:a|Link|button)>)[\s\S]){0,300}?(↗|&#8599;|&nearr;|ArrowUpRight|ExternalLink)' \
  -g '*.tsx' -g '*.jsx' src/
```

A hit is confirmed once you have read the `href`: `#...` and `/...` stay on the site, and a `<button>` never leaves the page.

## False positives

- **Site-relative paths that leave the app.** `/docs` served by a separate docs host, or `/blog` proxied to another product, are off-site in practice and may justify the arrow. Check the routing before reporting.
- **An `href` built from a variable** (`href={docsUrl}`) will not match; if it resolves to an external URL, the arrow is correct.
- **The glyph as data**, such as a trend indicator in a table cell or a "rising" badge, is not a link affordance. The pattern only matches inside links and buttons, but read the hit.

## Fix

```tsx
// before: promises a new destination, scrolls the same page
<a href="#pricing">Try Northwind <span aria-hidden="true">↗</span></a>

// after
<Link href="/signup">Try Northwind <span aria-hidden="true">→</span></Link>
```

## Why this needs a rule

Models reach for ↗ as a stylish "action" glyph because it is common on design-forward sites, without the distinction those sites keep between leaving and staying.

## Suppression

```tsx
{/* ui-audit-ignore:slop-external-arrow-internal-link, /docs is served by the separate docs host */}
```
