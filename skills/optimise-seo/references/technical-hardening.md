# Technical Hardening: Security, Privacy, Resilience

The non-content layer: transport and header security, consent obligations, graceful failure. Headers, policies, and status behaviour only; no visual work.

## Contents

- [Security headers](#security-headers)
- [Cookies](#cookies)
- [security.txt and DNS](#securitytxt-and-dns)
- [Privacy and consent](#privacy-and-consent)
- [Resilience](#resilience)

## Security headers

The `next.config.ts` `headers()` form is in `nextjs-implementation.md`. Test at securityheaders.com or Mozilla Observatory.

| Header | Value | Notes |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | The preload list wants `max-age` of at least 31536000, `includeSubDomains`, and `preload`. Removal takes months to reach browsers, so ramp first: `max-age=300`, then `604800`, then `2592000`, waiting out each stage, and add `preload` only once every subdomain (including `www` if it has a DNS record) serves HTTPS. |
| `Content-Security-Policy` | start at `default-src 'self'`, allow-list real origins, `frame-ancestors 'none'` or `'self'`, `object-src 'none'`, `base-uri 'self'` | Roll out as `Content-Security-Policy-Report-Only` first. Nonces force dynamic rendering in Next.js; see the CSP section of `nextjs-implementation.md` before choosing them. |
| `X-Content-Type-Options` | `nosniff` | Stops a benign upload being sniffed into script. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits URL leakage to other origins. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` plus anything else unused | Applies to your pages and embedded iframes. |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolates the browsing context from cross-origin popups. |
| `Cross-Origin-Resource-Policy` | `same-origin`, with `cross-origin` on `/opengraph-image` | The catch-all value blocks every social scraper from fetching the share card; the per-route rule after it wins for that path. |
| `X-Powered-By` | absent | Next.js adds `x-powered-by: Next.js` by default; set `poweredByHeader: false` in `next.config.ts`. |

`frame-ancestors` in the CSP supersedes `X-Frame-Options`; shipping both is harmless and satisfies scanners that still look for the legacy header. Two `Content-Security-Policy` headers on one response are intersected by the browser, not overridden, so a site that proxies another app under a path prefix must exclude that prefix from its own CSP rule and let the proxied app set its own.

**Subresource Integrity.** Any third-party `<script>` or stylesheet you do not control gets `integrity="sha384-..."` and `crossorigin="anonymous"`, so a tampered file is refused. Next.js can hash its own bundles at build time with `experimental.sri`.

## Cookies

Every cookie: `Secure`, `HttpOnly` unless JavaScript needs it, and an explicit `SameSite`. Session cookies use the `__Host-` prefix, which forces `Secure`, `Path=/`, and no `Domain`, so a subdomain cannot overwrite it.

```
Set-Cookie: __Host-session=...; Secure; HttpOnly; SameSite=Lax; Path=/
```

## security.txt and DNS

- `/.well-known/security.txt` with `Contact:` and `Expires:`; an expired file is treated as absent by researchers' tooling.
- A DNS CAA record restricting which CAs may issue for the domain. DNSSEC is optional and needs registrar plus registry support.

```
# public/.well-known/security.txt
Contact: mailto:security@example.com
Expires: 2027-09-01T00:00:00.000Z
```

## Privacy and consent

- **Privacy policy** states what is collected, why, the legal basis, sharing, retention, and user rights. Keep it accurate to the scripts actually loaded.
- **Opt-in consent (EU/UK).** Non-essential cookies and storage are set only after freely given, specific consent. Reject is as easy as accept; no pre-ticked boxes; the analytics script does not fire before the choice.
- **Google Consent Mode v2.** Any Google Ads or GA4 tag serving EEA/UK traffic has needed all four consent signals since March 2024: `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`. Without the last two, conversion measurement and remarketing degrade for those users regardless of what the banner says. Set defaults to `denied` before the tag loads, update on choice, and use a Google-certified CMP when behavioural modelling matters. When CSP nonces are in play, pass the nonce to `<GoogleTagManager nonce={nonce} />` from `@next/third-parties/google`.
- **Global Privacy Control.** Honour `Sec-GPC: 1` as an opt-out of sale and sharing. Twelve US states treat it as legally binding as of 2026 (California, Colorado, Connecticut, Delaware, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Texas), and California has fined for ignoring it.
- **Privacy-respecting analytics** (aggregate, cookieless, EU-hostable, or server-side) sidesteps most of the consent surface for sites that only need traffic counts.
- **Third-party scripts.** Any cross-origin script can read cookies, the URL, and page data. Justify each, lock down with CSP and SRI, and delete the ones nobody can name an owner for.

## Resilience

- **404 and 500.** The status code has to match the page: a not-found page at 200 is a soft 404 and a broken page at 200 is indexed as content. The streaming rules that make this hard in Next.js are in `nextjs-implementation.md`. Never leak stack traces; production `error.tsx` receives a digest, not the message.
- **Maintenance.** Return 503 with `Retry-After` so crawlers pause instead of deindexing, and say when the site returns.

```ts
return new Response(maintenanceHtml, {
  status: 503,
  headers: { 'Content-Type': 'text/html', 'Retry-After': '3600' },
})
```

- **Web app manifest** (`app/manifest.ts`) so the site installs cleanly; the Next.js form is in `nextjs-implementation.md`.
- **Monitoring** from outside your own infrastructure (synthetic plus real-user), with the status page hosted on a separate provider so it stays up when the site does not.
