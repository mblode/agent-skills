# Technical Hardening: Security, Privacy, Resilience

The non-content layer a good site ships: transport and header security, privacy/consent obligations, and graceful failure. These complement SEO: a site that leaks data, ignores consent law, or returns 200 for an error page loses trust and rankings. No visual redesigns; these are headers, policies, and error/status behaviour.

## Contents
- [Security headers](#security-headers)
- [Cookies](#cookies)
- [security.txt and DNS](#securitytxt-and-dns)
- [Privacy](#privacy)
- [Resilience](#resilience)

## Security headers

Set these on every HTML response (see `nextjs-implementation.md` for the `next.config` `headers()` form). Test the result at securityheaders.com or Mozilla Observatory.

| Header | Recommended value | Why |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS. **Effectively irreversible:** only add `preload`/`includeSubDomains` once every subdomain is HTTPS. |
| `Content-Security-Policy` | start with `default-src 'self'`, allow-list real origins; prefer nonces/hashes over `'unsafe-inline'` | Stops most XSS and data exfiltration. Roll out in `Content-Security-Policy-Report-Only` first. |
| `X-Content-Type-Options` | `nosniff` | Stops MIME-sniffing a benign file into script/style. |
| `Content-Security-Policy: frame-ancestors` | `'self'` (or trusted embedders) | Clickjacking protection. `X-Frame-Options: SAMEORIGIN` is the legacy fallback. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits URL leakage to other origins. |
| `Permissions-Policy` | disable unused features, e.g. `camera=(), microphone=(), geolocation=()` | Turns off powerful APIs for your pages and embedded iframes. |

**Prerequisites, not headers:** serve everything over HTTPS with TLS 1.2/1.3 (redirect HTTP→HTTPS, disable SSL/early TLS).

**Subresource Integrity (SRI):** for any third-party `<script>`/`<link>` you don't control, add `integrity="sha384-…"` + `crossorigin="anonymous"` so the browser refuses a tampered file.

```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-…" crossorigin="anonymous"></script>
```

## Cookies

Every cookie: `Secure`, `HttpOnly` where JS doesn't need it, and an explicit `SameSite`. Use the `__Host-` prefix for session cookies (forces Secure + path=/ + no Domain).

```
Set-Cookie: __Host-session=…; Secure; HttpOnly; SameSite=Lax; Path=/
```

## security.txt and DNS

- Publish `/.well-known/security.txt` with a `Contact:` and `Expires:` so researchers can report vulnerabilities.
- Add a DNS **CAA** record to restrict which CAs may issue certs for the domain. DNSSEC is optional defence-in-depth (needs full registrar + registry support).

```
# /.well-known/security.txt
Contact: mailto:security@example.com
Expires: 2027-01-01T00:00:00.000Z
```

## Privacy

- **Privacy policy:** state what personal data is collected, why, legal basis, sharing, retention, and user rights.
- **Cookie consent:** in the EU/UK, non-essential cookies/storage need freely-given, specific, **opt-in** consent *before* they are set. No pre-ticked boxes; reject must be as easy as accept.
- **Global Privacy Control (GPC):** honour the `Sec-GPC: 1` request signal as an opt-out of sale/sharing (legally required in California and Colorado).
- **Privacy-respecting analytics:** prefer aggregate, cookieless, EU-hostable analytics (e.g. Plausible, Fathom, server-side) to avoid consent and data-transfer problems.
- **Data minimisation:** collect only what a specific purpose needs, keep it only as long as needed, and redact it from logs/URLs where it leaks.
- **Audit third-party scripts:** any cross-origin script can read cookies and the URL and exfiltrate page data. Justify each one; lock down with CSP + SRI.

## Resilience

- **Custom 404 / 500:** return the **correct** status code (a "not found" page must be `404`, not `200`; see soft-404 in `SKILL.md`). Explain the problem in plain language and offer a way forward; never leak stack traces.
- **Maintenance:** return `503` with a `Retry-After` header so crawlers don't deindex; show when the site will return.
- **Web app manifest:** ship `app/manifest.ts` (name, icons, `start_url`, `theme_color`, `display`) so the site installs cleanly.
- **Monitoring:** monitor from outside your own infra (synthetic + real-user), and host the status page on a separate provider so it stays up when the site doesn't.

```ts
// Maintenance response
return new Response(maintenanceHtml, {
  status: 503,
  headers: { "Content-Type": "text/html", "Retry-After": "3600" },
});
```
