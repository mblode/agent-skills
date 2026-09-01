# Next.js SEO Implementation

App Router patterns, checked against the Next.js 16 docs (September 2026). Where behaviour changed in 16 (Proxy, Cache Components, promised `params` and `id`) the note says so, because most of the sites this skill touches are mid-upgrade.

## Contents

- [Metadata](#metadata)
- [Sitemap and robots](#sitemap-and-robots)
- [Redirects and canonical host](#redirects-and-canonical-host)
- [Indexing policy](#indexing-policy)
- [404 and status codes under streaming](#404-and-status-codes-under-streaming)
- [Structured data](#structured-data)
- [OG images](#og-images)
- [Security headers and CSP](#security-headers-and-csp)
- [Manifest](#manifest)
- [File structure](#file-structure)

## Metadata

Set `metadataBase` once in the root layout so every URL-based field below it can be relative. A relative `openGraph.images` or `alternates.canonical` with no `metadataBase` is a build error.

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: { default: 'Brand', template: '%s | Brand' },
  description: 'What the site is, in one sentence.',
  openGraph: { type: 'website', siteName: 'Brand' },
  twitter: { card: 'summary_large_image' },
}
```

```tsx
// app/blog/[slug]/page.tsx: params is a Promise (Next.js 15+)
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  return {
    title: post.title,                       // template adds " | Brand"
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: 'article', publishedTime: post.publishedAt, authors: [post.authorName] },
  }
}
```

Viewport, `themeColor`, and `colorScheme` moved to `generateViewport` in Next.js 14; putting them in `metadata` warns and is ignored.

**Streaming metadata.** When `generateMetadata` does request-time work, Next.js streams the page and appends the metadata tags to `<body>` for JavaScript-capable clients, and blocks to put them in `<head>` only for user agents in its HTML-limited bot list (`facebookexternalhit`, `Twitterbot`, and similar). Googlebot renders the DOM and reads either placement. `curl` is not on the list, so a raw `curl` check may find `<link rel="canonical">` in the body; pass `-A Twitterbot` to see the blocking form. Set `htmlLimitedBots: /.*/` in `next.config.ts` only if a downstream consumer needs head placement for every request; it costs TTFB.

**Cache Components** (`cacheComponents: true`, the `scaffold-nextjs` default). `generateMetadata` follows component rules: external data goes behind `'use cache'`, and a `URL` instance is not serialisable inside it, so return `metadataBase` as a string there.

## Sitemap and robots

Google ignores `<priority>` and `<changefreq>` and uses `<lastmod>` only when it is "consistently and verifiably accurate", so emit `url`, `lastModified`, and `alternates.languages`, and skip the rest. `lastModified: new Date()` on every row teaches Google to distrust the field sitewide.

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/content'

const origin = 'https://example.com'

function latest(dates: string[], fallback: Date): Date {
  const times = dates.map(d => new Date(d).getTime()).filter(t => !Number.isNaN(t))
  return times.length > 0 ? new Date(Math.max(...times)) : fallback
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const buildDate = new Date()
  return [
    { url: origin, lastModified: latest(posts.map(p => p.updatedAt ?? p.publishedAt), buildDate) },
    { url: `${origin}/blog`, lastModified: latest(posts.map(p => p.updatedAt ?? p.publishedAt), buildDate) },
    ...posts.map(p => ({ url: `${origin}/blog/${p.slug}`, lastModified: new Date(p.updatedAt ?? p.publishedAt) })),
  ]
}
```

Hub rows (homepage, `/blog`) take the freshest child date, so they move when content moves and stay put when it does not.

**Caching.** `sitemap.ts` is a Route Handler cached by default. Without Cache Components, `export const revalidate = 3600` keeps it fresh on a site that publishes often. With `cacheComponents: true` that export fails the build; move the data call into a helper marked `'use cache'` with `cacheLife('hours')` and `cacheTag('posts')`, then `revalidateTag('posts', 'max')` from the publish webhook.

**Over 50,000 URLs or 50 MB.** Export `generateSitemaps()` returning `[{ id: 0 }, { id: 1 }, ...]`; the default function receives `id` as `Promise<string>` (Next.js 16; a plain number before). Files are served at `/<segment>/sitemap/<id>.xml`, for example `app/product/sitemap.ts` yields `/product/sitemap/0.xml`. Next.js does not write a sitemap index: either list every generated file in `robots.ts` (`sitemap` accepts an array) or hand-write an index at `app/sitemap-index.xml/route.ts` and submit that.

**Images and video** only need `images`/`videos` rows when the media is JS-loaded or CDN-hosted and not reachable by following links.

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
    sitemap: 'https://example.com/sitemap.xml',
    host: 'https://example.com',
  }
}
```

Per-crawler rules for AI agents and the `Content-Signal` line are in `answer-engines.md`.

## Redirects and canonical host

`next.config.ts` redirects run before the filesystem and before Proxy. `permanent: true` emits 308, `false` emits 307; Next.js uses these over 301/302 to preserve the request method. `statusCode` replaces `permanent` when an old client needs a literal 301.

```ts
// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  async redirects() {
    return [
      { source: '/old-path', destination: '/new-path', permanent: true },
      {
        // Canonical host: www -> apex, matched on host, one hop.
        source: '/:path*',
        has: [{ type: 'host', value: 'www.example.com' }],
        destination: 'https://example.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default config
```

If the platform already redirects at the edge (a Vercel domain redirect, a Cloudflare rule), set the 308 there and delete the config rule; two layers produce a chain. Inside a Server Component, `permanentRedirect()` is 308 and `redirect()` is 307 (303 for a progressive-enhancement form submission). Both throw, so call them outside `try/catch`.

**Proxy replaces middleware.** Next.js 16 renamed `middleware.ts` to `proxy.ts` and the export to `proxy`; the old name still runs but is deprecated, and `skipMiddlewareUrlNormalize` became `skipProxyUrlNormalize`. `npx @next/codemod@canary middleware-to-proxy .` does the rename. Proxy runs on the Node.js runtime only.

## Indexing policy

Public pages default to `index, follow`. Mark everything else explicitly: `metadata.robots` for HTML routes, `X-Robots-Tag` for non-HTML responses (PDFs, feeds, JSON) and for whole non-production environments.

```tsx
export const metadata: Metadata = { robots: { index: false, follow: false } }
```

```ts
// next.config.ts: whole-environment noindex, gated on the deploy env
async headers() {
  if (process.env.VERCEL_ENV === 'production') return []
  return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }]
}
```

Vercel already adds `X-Robots-Tag: noindex` to every preview deployment and to the previous production deployment after a promotion. It omits the header when a custom domain is attached to a non-production branch (`staging.example.com`), so those environments need the header above.

Canonical and `noindex` do different jobs. A preview or staging URL is `noindex`. A duplicate that should consolidate onto the real page (trailing-slash variant, tracking-parameter URL, syndicated copy) gets `rel="canonical"` and stays indexable; Google says it does "not recommend using noindex to prevent selection of a canonical page within a single site". Do not use `robots.txt` for canonicalisation either: disallowed URLs can still be indexed without content.

## 404 and status codes under streaming

`notFound()` returns a real 404 only if it runs before the response starts streaming. Once a Suspense boundary (including `loading.tsx`) has flushed, the 200 header is already sent, so Next.js streams the not-found UI with `<meta name="robots" content="noindex">` instead. Google does not index those, but Search Console lists them as soft 404s and analytics sees a 200.

Rules that keep the status honest:

- Call `notFound()` before the first `await` that can suspend and before any `<Suspense>` in the segment.
- For catalogue-style routes, verify the slug in `proxy.ts` (a fast existence check, not a content fetch) and rewrite misses to the not-found route or return a 404 `Response` directly.
- Apps with multiple root layouts or a top-level `[locale]` segment use `app/global-not-found.tsx` (`experimental.globalNotFound: true`), which bypasses rendering and returns 404 for unmatched URLs.

`error.tsx` renders inside an already-started response as well, so a data failure on an indexable page ships as 200 with error copy. Fail loudly in the data layer (throw before render, or `notFound()` for a missing record) rather than relying on the boundary for status.

## Structured data

```tsx
// components/json-ld.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
```

`JSON.stringify` is safe here because schema objects carry no user-supplied HTML. If a field ever does, replace `<` with `<` in the serialised string before injecting it.

**Entity graph.** Define each entity once with a stable `@id`, emit the shared ones in the root layout inside a single `@graph`, and have per-page schema point back by `@id`. Search engines then resolve one knowledge graph instead of disconnected snippets, and a rename happens in one place.

```tsx
// lib/site.ts
export const orgId = 'https://example.com/#organization'
export const websiteId = 'https://example.com/#website'
export const personId = 'https://example.com/#person'

// app/layout.tsx
<JsonLd data={{
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': orgId, name: 'Brand', url: 'https://example.com',
      logo: 'https://example.com/logo.png', sameAs: ['https://www.linkedin.com/company/...'] },
    { '@type': 'WebSite', '@id': websiteId, name: 'Brand', url: 'https://example.com', publisher: { '@id': orgId } },
    { '@type': 'Person', '@id': personId, name: 'Author Name', url: 'https://example.com/about',
      worksFor: { '@id': orgId }, sameAs: ['https://github.com/...'] },
  ],
}} />
```

```tsx
// Inner pages
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })),
}} />

// Articles. Google's Article doc has no required properties; recommended are headline,
// image (three aspect ratios), datePublished, dateModified, author (with author.name and
// author.url). publisher is optional; when present, make it the Organization with a logo.
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  image: [post.image16x9, post.image4x3, post.image1x1],
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: { '@id': personId },
  publisher: { '@id': orgId },
  isPartOf: { '@id': websiteId },
  mainEntityOfPage: `https://example.com/blog/${post.slug}`,
}} />

// Identity pages (/about, /now)
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://example.com/about#webpage',
  isPartOf: { '@id': websiteId },
  mainEntity: { '@id': personId },
}} />
```

Fill recommended fields, not only required ones: Search Console reports missing recommended fields as rich-result warnings (an `Event` wants `endDate`, `offers`, `image`, `eventStatus`, `eventAttendanceMode`, a full `PostalAddress`, and `organizer.url`). Types Google has dropped from rich results and should not be added for that reason: `FAQPage` (May 2026), `HowTo` (2023), Book Actions, Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing (June 2025), Practice Problem (January 2026). Product, Review, Article, Recipe, Video, Organization, LocalBusiness, BreadcrumbList, and ProfilePage still produce results.

## OG images

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const alt = 'Post title card'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)', color: 'white', fontSize: 64, fontWeight: 'bold' }}>
      {post.title}
    </div>,
    size,
  )
}
```

File-based images (`opengraph-image.png` plus `opengraph-image.alt.txt`) need no code and cannot drift from the meta tags. Generated images are statically optimised unless they read request data. `twitter-image` falls back to the OG image when absent; the file limits are 8 MB (OG) and 5 MB (Twitter) and exceeding them fails the build.

When recompressing `public/` assets for CWV, keep filenames and formats so references stay valid. An avatar reused as the `Person` `image` is served to crawlers too, so its size matters twice.

## Security headers and CSP

Static headers go in `next.config.ts`:

```ts
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests" },
    ],
  }]
}
```

A nonce-based CSP (`script-src 'nonce-...' 'strict-dynamic'`) needs a fresh nonce per request, which means generating it in `proxy.ts`, forwarding it as an `x-nonce` request header, and rendering every page dynamically: static generation, ISR, and the Partial Prerendering shell all stop applying. Take that trade only when compliance forbids `'unsafe-inline'`; otherwise the static header above, or the experimental build-time SRI (`experimental.sri.algorithm: 'sha256'`), keeps pages prerenderable. Roll any new policy out as `Content-Security-Policy-Report-Only` first. Values and the HSTS ramp: `technical-hardening.md`.

## Manifest

```ts
// app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Brand', short_name: 'Brand', start_url: '/', display: 'standalone',
    theme_color: '#1e3a8a', background_color: '#ffffff',
    icons: [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  }
}
```

## File structure

```
app/
├── layout.tsx              # metadataBase, title template, shared @graph
├── sitemap.ts
├── robots.ts
├── manifest.ts
├── icon.svg
├── apple-icon.png
├── not-found.tsx           # or global-not-found.tsx with multiple root layouts
├── llms.txt/route.ts       # optional, see answer-engines.md
└── blog/[slug]/
    ├── page.tsx            # generateMetadata + JsonLd
    └── opengraph-image.tsx

proxy.ts                    # slug existence checks, CSP nonces, Accept negotiation
next.config.ts              # redirects(), headers()
components/json-ld.tsx
lib/site.ts                 # stable @id constants
public/.well-known/security.txt
```
