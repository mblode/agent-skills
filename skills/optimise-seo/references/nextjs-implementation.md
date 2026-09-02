# Next.js SEO Implementation

App Router patterns, checked against the Next.js 16.3 docs bundled at `node_modules/next/dist/docs/` (September 2026). Where behaviour changed in 16 (Proxy, Cache Components, promised `params` and `id`) the note says so, because most of the sites this skill touches are mid-upgrade. When in doubt, the bundled doc for the installed version wins over this file.

## Contents

- [Metadata](#metadata)
- [How metadata merges](#how-metadata-merges)
- [Sitemap and robots](#sitemap-and-robots)
- [Redirects and canonical host](#redirects-and-canonical-host)
- [Indexing policy](#indexing-policy)
- [404 and status codes under streaming](#404-and-status-codes-under-streaming)
- [Structured data](#structured-data)
- [OG images](#og-images)
- [Route handlers under Cache Components](#route-handlers-under-cache-components)
- [IndexNow](#indexnow)
- [Security headers and CSP](#security-headers-and-csp)
- [Manifest](#manifest)
- [File structure](#file-structure)

## Metadata

Set `metadataBase` once in the root layout so every URL-based field below it can be relative. A relative `openGraph.images` or `alternates.canonical` with no `metadataBase` is a build error. Set the Google preview caps and attribution there too; a page never needs to repeat them.

```tsx
// app/layout.tsx
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: { default: 'Brand', template: '%s | Brand' },
  description: 'What the site is, in one sentence.',
  authors: [{ name: 'Author Name', url: 'https://example.com/about' }],
  creator: 'Author Name',
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/feed.xml' }, // sites with a feed
  },
  robots: {
    index: true,
    follow: true,
    // Google's defaults cap the snippet and the image preview. AI surfaces
    // read against the snippet cap when deciding how much they may quote.
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: { type: 'website', siteName: 'Brand', locale: 'en_US' },
  // Only `card` here. A title or description in the root twitter block is
  // inherited verbatim by every inner page that declares no twitter block, so
  // /support would share as the home page.
  twitter: { card: 'summary_large_image', creator: '@brand' },
}

export const viewport: Viewport = {
  themeColor: [
    { color: '#fff', media: '(prefers-color-scheme: light)' },
    { color: '#0f0f0f', media: '(prefers-color-scheme: dark)' },
  ],
}
```

```tsx
// app/blog/[slug]/page.tsx: params is a Promise (Next.js 15+)
export async function generateMetadata(
  { params }: PageProps<'/blog/[slug]'>
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug) // wrap in React `cache()` so the page reuses it
  if (!post) return {}            // the page's notFound() sets the status
  return {
    title: post.title,                       // template adds " | Brand"
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      // Declaring openGraph replaces the root block: restate what it carried.
      type: 'article',
      siteName: 'Brand',
      locale: 'en_US',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ['https://example.com/about'],
    },
  }
}
```

`PageProps<'/blog/[slug]'>` is a global helper Next.js generates during `next dev`, `next build`, or `next typegen`; it types `params` and `searchParams` without an import. Viewport, `themeColor`, and `colorScheme` moved to the `viewport` export in Next.js 14; putting them in `metadata` warns and is ignored.

**Streaming metadata.** When `generateMetadata` does request-time work, Next.js streams the page and appends the metadata tags to `<body>` for JavaScript-capable clients, and blocks to put them in `<head>` only for user agents in its HTML-limited bot list (`facebookexternalhit`, `Twitterbot`, `Slackbot`, `Bingbot`, and similar). Googlebot renders the DOM and reads either placement. `curl` is not on the list, so a raw `curl` check may find `<link rel="canonical">` in the body; pass `-A Twitterbot` to see the blocking form. Prerendered pages never stream metadata. Set `htmlLimitedBots: /.*/` in `next.config.ts` only if a downstream consumer needs head placement for every request; it costs TTFB.

**Cache Components** (`cacheComponents: true`, the `scaffold-nextjs` default). `generateMetadata` follows component rules. External data that is not request-bound goes behind `'use cache'` inside the function; leave `metadataBase` in the static root `metadata` export, since a cached function must return serialisable values and a `URL` instance is not one. Reading runtime data (`cookies()`, `headers()`, `params`, `searchParams`) while the rest of the page is prerenderable raises `blocking-prerender-metadata-runtime`, and an uncached fetch raises `blocking-prerender-metadata-dynamic`; the fix is either `'use cache'` or a `<Suspense>`-wrapped component that awaits `connection()` so the page declares its dynamic content intentionally.

## How metadata merges

Metadata is evaluated root layout first, then each nested layout, then the page, and the objects are **shallowly** merged. A scalar (`title`, `description`, `authors`) from a child replaces the parent's scalar. An object (`openGraph`, `twitter`, `robots`, `alternates`, `icons`) from a child replaces the parent's whole object; nothing inside it is inherited. The two are indistinguishable in source, which is why none of this shows up in review. Consequences, each of which has shipped:

- A page that declares `openGraph: { title }` loses `siteName`, `images`, `locale`, and `type` from the root. Restate them, or spread a shared object (`openGraph: { ...sharedOpenGraph, title }`) from a `lib/site.ts` helper.
- `images: undefined` is itself a declaration. Build the images object conditionally and spread it, so the key is genuinely absent when you mean "inherit".
- A file-convention image (`opengraph-image.*`) attaches to the segment its file sits in, which is the root layout's. A deeper segment that declares its own `openGraph` block drops the inherited card; declare `images` explicitly there. The self-check: your explicit value should equal the URL Next injects on a page that declares no `openGraph`, minus its cache-busting hash.
- `title.template` applies to `<title>` only. `og:title` resolves against `openGraph.title.template`, tracked separately. Removing a hand-rolled suffix from a page title fixes `<title>` and silently strips the product from the card; set both templates in the layout when inner titles are bare. The inverse trap: explicit titles that already carry the product, plus a template, produce `Install: Acme | Acme`.
- A bare string `title` in a nested layout resets the inherited template to null for that subtree. Return `{ default, template }` from nested layouts.
- Never set `openGraph.url` in a root layout; it is not per-page, and a child cannot override it without declaring `openGraph` and losing the rest. `alternates.canonical` is already per-page, and consumers fall back to the fetched URL.
- A `twitter` block in the root with `title` and `description` is inherited verbatim by every route that declares no `twitter`, so inner pages share as the home page. Keep only `card` and `creator` there and let Next fill title and description per page.

The screening question is not "does the home page look right" but "does a route that inherits from the root layout look right, and does any route declare its own `openGraph` or `twitter` while relying on something inherited". Sample three inner routes from the sitemap, spread across sections, and read `og:site_name`, `og:image`, and `twitter:creator` out of the built HTML.

## Sitemap and robots

Google ignores `<priority>` and `<changefreq>` and uses `<lastmod>` only when it is "consistently and verifiably accurate", so emit `url`, `lastModified`, and `alternates.languages`, and skip the rest. `lastModified: new Date()` on every row teaches Google to distrust the field sitewide.

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/content'

const origin = 'https://example.com'
// Hand-maintained dates for static pages: the date the copy last changed, not
// the build date. Each page carries its own so a new page does not backdate or
// refresh every other one.
const aboutLastModified = new Date('2026-06-26')

function latest(dates: string[], fallback: Date): Date {
  const times = dates.map(d => new Date(d).getTime()).filter(t => !Number.isNaN(t))
  return times.length > 0 ? new Date(Math.max(...times)) : fallback
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const latestPost = latest(posts.map(p => p.updatedAt ?? p.publishedAt), aboutLastModified)
  return [
    { url: origin, lastModified: latestPost },
    { url: `${origin}/about`, lastModified: aboutLastModified },
    { url: `${origin}/blog`, lastModified: latestPost },
    ...posts.map(p => ({ url: `${origin}/blog/${p.slug}`, lastModified: new Date(p.updatedAt ?? p.publishedAt) })),
  ]
}
```

Hub rows (homepage, `/blog`) take the freshest child date, so they move when content moves and stay put when it does not. Pages that are deliberately `noindex` (a thin utility page) stay out of the sitemap, with a comment saying so, and every sitemap URL needs an internal link somewhere or it is an orphan.

**Caching.** `sitemap.ts` is a Route Handler cached by default. Without Cache Components, `export const revalidate = 3600` keeps it fresh on a site that publishes often. With `cacheComponents: true` that export fails the build (as does any `dynamic` or `fetchCache` export); move the data call into a helper marked `'use cache'` with `cacheLife('hours')` and `cacheTag('posts')`, then `revalidateTag('posts', 'max')` from the publish webhook.

**Over 50,000 URLs or 50 MB, or several sources.** Export `generateSitemaps()` returning `[{ id: 0 }, { id: 1 }, ...]`; the default function receives `id` as `Promise<string>` (Next.js 16; a plain number before). Files are served at `/<segment>/sitemap/<id>.xml`, for example `app/product/sitemap.ts` yields `/product/sitemap/0.xml`. Next.js does not write a sitemap index. Either list every generated file in `robots.ts` (`sitemap` accepts an array) or hand-write the index yourself: a route handler at `app/sitemap.xml/route.ts` returning a `<sitemapindex>` that points at `sitemap-main.xml` and each other file keeps `/sitemap.xml` the single URL to submit to Search Console, and `robots.ts` lists that one URL only. Repeating the children in `robots.ts` double-advertises them.

**Images and video** only need `images`/`videos` rows when the media is JS-loaded or CDN-hosted and not reachable by following links.

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
    sitemap: 'https://example.com/sitemap.xml',
    // No `host`. Yandex dropped the directive in 2018 in favour of a 301 to
    // the preferred host, and auditors flag the line as unknown.
  }
}
```

Per-crawler rules for AI agents and the `Content-Signal` line are in `answer-engines.md`. Google ignores a `Disallow` on a login or search URL only in the sense that it may still index the URL without content, so a page that must stay out of results needs `noindex`, not a robots rule.

## Redirects and canonical host

`next.config.ts` redirects run before the filesystem and before Proxy. `permanent: true` emits 308, `false` emits 307; Next.js uses these over 301/302 to preserve the request method. `statusCode` replaces `permanent` when an old client needs a literal 301 (Next.js adds a `Refresh` header on 308 for IE11 anyway).

```ts
// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  async redirects() {
    return [
      { source: '/old-path', destination: '/new-path', permanent: true },
      // Renamed section. Bare path first, or `/blog` falls through the
      // `:path*` form and lands on `/writing/`.
      { source: '/blog', destination: '/writing', permanent: true },
      // Markdown twins alongside the HTML rule, so an agent fetching `.md`
      // never costs a second hop.
      { source: '/blog.md', destination: '/writing.md', permanent: true },
      { source: '/blog/:path*', destination: '/writing/:path*', permanent: true },
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

Rules match in array order, and `:path*` swallows every URL beneath it, so anything more specific has to sit above the catch-all or it becomes dead code. A renamed slug that would otherwise chain (`/old/x` to `/new/x` to `/new/y`) gets its own entry above the wildcard so it resolves in one hop. Alternate hosts need the specific rules repeated with a `has: [{ type: 'host' }]` clause, or a visitor on the old host takes one hop to the apex and a second to the new path; generate them with a `flatMap` over the host list rather than by hand. Vercel caps `redirects()` at 1,024 entries; beyond that, keep the map in Proxy (a Bloom filter over a JSON map is the documented pattern).

If the platform already redirects at the edge (a Vercel domain redirect, a Cloudflare rule), set the 308 there and delete the config rule; two layers produce a chain. Inside a Server Component, `permanentRedirect()` is 308 and `redirect()` is 307 (303 for a progressive-enhancement form submission). Both throw, so call them outside `try/catch`. A retired subdomain that stays attached to the project needs its redirect in `next.config.ts` with `basePath: false`; a DNS-only zone never passes through a CDN rule.

**Proxy replaces middleware.** Next.js 16 renamed `middleware.ts` to `proxy.ts` and the export to `proxy`; the old name still runs but is deprecated, and `skipMiddlewareUrlNormalize` became `skipProxyUrlNormalize`. `npx @next/codemod@canary middleware-to-proxy .` does the rename. Proxy runs on the Node.js runtime only and the `runtime` export is an error there. Execution order: `headers()`, then `redirects()`, then Proxy, then `beforeFiles` rewrites, the filesystem, `afterFiles`, dynamic routes, and `fallback`. Without a `matcher` Proxy runs on every request including `_next/static` and `public/` assets; use the documented negative lookahead and add each literal path you rewrite.

## Indexing policy

Public pages default to `index, follow`. Mark everything else explicitly: `metadata.robots` for HTML routes, `X-Robots-Tag` for non-HTML responses (PDFs, feeds, JSON, Markdown twins) and for whole non-production environments.

```tsx
export const metadata: Metadata = { robots: { index: false, follow: true } }
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

- Call `notFound()` before the first `await` that can suspend and before any `<Suspense>` in the segment. `generateMetadata` may call it too.
- For catalogue-style routes, verify the slug in `proxy.ts` (a fast existence check, not a content fetch) and rewrite misses to the not-found route or return a 404 `Response` directly.
- Apps with multiple root layouts or a top-level `[locale]` segment use `app/global-not-found.tsx` (`experimental.globalNotFound: true`), which bypasses rendering and returns 404 for unmatched URLs. It must return a full document, and it imports its own styles and fonts.
- Give the 404 page `robots: { index: false, follow: true }` and a few recovery links (sitemap, the main archive, `llms.txt`), and say in the copy that it is a real 404. Agents read that line.

`error.tsx` renders inside an already-started response as well, so a data failure on an indexable page ships as 200 with error copy. Fail loudly in the data layer (throw before render, or `notFound()` for a missing record) rather than relying on the boundary for status. `app/global-error.tsx` is the fallback for the root layout itself; on a `ChunkLoadError` after a deploy the right recovery is a reload, and `deploymentId` in `next.config.ts` prevents most of those.

## Structured data

```tsx
// components/json-ld.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify does not escape `<`. The unicode escape is the Next.js
      // JSON-LD guide's recommendation; a native <script>, not next/script,
      // because this is data, not executable code.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll('<', '\\u003c') }}
    />
  )
}
```

Every claim in the JSON-LD must be verifiable in the served HTML. Google calls markup for content a user cannot see a structured-data policy violation, and answer engines quote the DOM, so a `FAQPage` whose answers never render, a `description` fed only to schema, or a `BreadcrumbList` naming a crumb the visible trail lacks is a defect. Copy that only reaches JSON-LD (`SpeakingEntry.highlights`, `CaseStudy.outcome`) is the usual source; check the card component before authoring new fields. Emit one `@graph` per page, not N scripts: disconnected nodes cannot be merged into one entity, and the RSC payload repeats the escaped string, so count `<script` tags rather than grepping for `ld+json`.

**Entity graph.** Define each entity once with a stable `@id`, emit the shared ones in the root layout inside a single `@graph`, and have per-page schema point back by `@id`. Search engines then resolve one knowledge graph instead of disconnected snippets, and a rename happens in one place. A project served under the main site by rewrite (a `basePath` zone) references the host's `#person`, `#website`, and `#organization` ids and never redefines them: a second `#website` on one domain is a second site.

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
      logo: 'https://example.com/web-app-manifest-512x512.png', sameAs: ['https://www.linkedin.com/company/...'] },
    { '@type': 'WebSite', '@id': websiteId, name: 'Brand', url: 'https://example.com', publisher: { '@id': orgId } },
    { '@type': 'Person', '@id': personId, name: 'Author Name', url: 'https://example.com/about',
      worksFor: { '@id': orgId }, sameAs: ['https://github.com/...'] },
  ],
}} />
```

`sameAs` on a `Person` lists profiles of the same person (GitHub, LinkedIn, X). Employer, product, and investor URLs describe organisations and go through `worksFor`, `affiliation`, or `memberOf`; listing them in `sameAs` conflates the person with those entities.

```tsx
// Inner pages. The visible trail and this list must stay identical: Google
// treats a mismatch between rendered breadcrumbs and BreadcrumbList as an error.
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
  '@id': `https://example.com/blog/${post.slug}`,
  headline: post.title,
  image: [post.image16x9, post.image4x3, post.image1x1],
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: { '@id': personId },
  publisher: { '@id': orgId },
  isPartOf: { '@id': websiteId },
  mainEntityOfPage: `https://example.com/blog/${post.slug}`,
  wordCount: post.wordCount,
  timeRequired: `PT${post.readingMinutes}M`,
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

Fill recommended fields, not only required ones: Search Console reports missing recommended fields as rich-result warnings (an `Event` wants `endDate`, `offers`, `image`, `eventStatus`, `eventAttendanceMode`, a full `PostalAddress`, and `organizer.url`). Never claim a type the page does not show: a typeface is a `CreativeWork`, not a `SoftwareApplication`, and `SoftwareApplication` needs `offers` plus a rating or review for its rich result, which self-authored reviews cannot supply. Types Google has dropped from rich results and should not be added for that reason: `FAQPage` (May 2026), `HowTo` (2023), Book Actions, Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing (June 2025), Practice Problem (January 2026). Product, Review, Article, Recipe, Video, Organization, LocalBusiness, BreadcrumbList, and ProfilePage still produce results.

## OG images

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Post title card'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Module scope: the asset does not depend on the request. process.cwd() is the
// app directory (apps/web in a turborepo), so the path is relative to that.
// Satori reads TTF and OTF only; a woff2 throws "Unsupported OpenType signature".
const font = await readFile(join(process.cwd(), 'lib/og-assets/brand-600.ttf'))

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  padding: 80, background: '#fdc5d7', color: '#e8391c', fontFamily: 'Brand', fontSize: 96, fontWeight: 600 }}>
      {post.title}
    </div>,
    { ...size, fonts: [{ name: 'Brand', data: font, style: 'normal', weight: 600 }] },
  )
}
```

Satori supports flexbox and a CSS subset only: no `display: grid`, no `oklch()`, no CSS variables, so colours are hand-synced sRGB literals. File-based images (`opengraph-image.png` plus `opengraph-image.alt.txt`) need no code and cannot drift from the meta tags. Generated images are statically optimised unless they read request data. `twitter-image` falls back to the OG image when absent, so a separate byte-identical file is redundant; the file limits are 8 MB (OG) and 5 MB (Twitter) and exceeding them fails the build.

Three facts that only show up in built output:

- `app/opengraph-image.tsx` serves at `/opengraph-image`. `/opengraph-image.png` is a 404, so an explicit `openGraph.images` entry must not carry the extension.
- Under a `basePath`, Next prefixes the static `app/opengraph-image.png` URL with the base path and leaves a generated route unprefixed. A `metadataBase` that includes the base path therefore doubles the prefix on the PNG form and is correct on the generated form; a bare-origin `metadataBase` with the PNG form and relative canonicals is the other self-consistent pair. Half-migrating between them is what ships `/zone/zone/opengraph-image.png`.
- Verify against `next build` output, never `next dev`, which rewrites `metadataBase` to the dev origin and reports the opposite of production on exactly these questions.

When recompressing `public/` assets for CWV, keep filenames and formats so references stay valid. An avatar reused as the `Person` `image` is served to crawlers too, so its size matters twice.

## Route handlers under Cache Components

`sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`, and any `route.ts` that reads no request data are prerendered at build time and served static. Three consequences:

- Route segment config is gone: `export const dynamic = 'force-static'`, `revalidate`, and `fetchCache` fail the build. Freshness comes from `'use cache'` plus `cacheLife` on the data helper.
- Reading uncached or runtime data in a `GET` bails out of prerendering by throwing. A `try/catch` around the handler body catches that bail-out and, if it logs, adds a stack trace per handler to the build output. Set `experimental.hideLogsAfterAbort: true`, or keep the `try/catch` narrow.
- Anything per-request (an analytics capture for `llms.txt` reads, a request counter) cannot live in the handler; it runs once at build. Put it in `proxy.ts` behind `event.waitUntil()` so it stays off the response path, and read the `Host` header rather than `nextUrl.host` for any local-host guard, since dev normalises `nextUrl` to the server's own origin.

## IndexNow

Bing, Yandex, Naver, and Seznam accept push notifications of changed URLs through IndexNow; Google does not participate. Two pieces: a key file served at `https://example.com/<key>.txt` whose body is the key (a `public/` file, or a route handler behind an `afterFiles` rewrite of `/:key.txt` so `robots.txt` and `llms.txt` still win first), and a `POST` to `https://api.indexnow.org/indexnow` with `{ host, key, keyLocation, urlList }` from the publish webhook or a deploy hook. Up to 10,000 URLs per call. Derive `urlList` from the same source as the sitemap, and never submit a URL that `next.config.ts` redirects: a redirecting URL in a submission works against the consolidation the redirect exists for. Keep the submit endpoint behind a bearer secret.

## Security headers and CSP

Static headers go in `next.config.ts`. Every matching rule applies in array order and, per header key, the last value wins, so the catch-all comes first and per-route exceptions after it.

```ts
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        // `preload` deliberately absent: it is effectively irreversible. Add it
        // only after the ramp in technical-hardening.md and once every
        // subdomain serves HTTPS.
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()' },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests" },
      ],
    },
    {
      // The share card is fetched by other origins, so it opts out of the
      // same-origin CORP the catch-all sets.
      source: '/opengraph-image',
      headers: [{ key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' }],
    },
  ]
}
```

Use `/:path*` rather than `/(.*)` as the catch-all source. Next prefixes `basePath` onto the source, and `/zone/(.*)` needs a separator after the prefix, so it misses the zone root itself; `/:path*` matches it. In development add `'unsafe-eval'` to `script-src` (React Refresh needs it); production must not carry it. Each third-party origin the site actually loads (an analytics proxy, a booking widget's API) goes into the directive it uses, and a script that lazy-loads chunks from its own host belongs in `script-src` as well as `connect-src`. Roll a new policy out as `Content-Security-Policy-Report-Only` first, keeping an enforced `frame-ancestors 'none'` in the meantime, and read the violation reports before switching.

A nonce-based CSP (`script-src 'nonce-...' 'strict-dynamic'`) needs a fresh nonce per request, which means generating it in `proxy.ts`, forwarding it as an `x-nonce` request header, and rendering every page dynamically: static generation, ISR, and the Partial Prerendering shell all stop applying, and the docs mark PPR incompatible with nonces outright. Take that trade only when compliance forbids `'unsafe-inline'`; otherwise the static header above, or the experimental build-time SRI (`experimental.sri.algorithm: 'sha256'`), keeps pages prerenderable. Values and the HSTS ramp: `technical-hardening.md`.

## Manifest

The static `app/manifest.json` that a favicon generator emits is fine and needs no code; Next serves it and links it when `metadata.manifest` points at it. Generate it only when a value depends on data:

```ts
// app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Brand', short_name: 'Brand', start_url: '/', display: 'standalone',
    theme_color: '#1e3a8a', background_color: '#ffffff',
    icons: [
      { src: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
```

Under a `basePath`, manifest icon paths are raw URLs and are not prefixed for you; write the prefix in.

## File structure

```
app/
├── layout.tsx              # metadataBase, title templates, robots caps, shared @graph
├── sitemap.ts              # or sitemap.xml/route.ts as a hand-written index
├── robots.ts
├── manifest.json           # from the favicon generator, or manifest.ts
├── favicon.ico, icon0.svg, icon1.png, apple-icon.png
├── opengraph-image.png + opengraph-image.alt.txt   # or opengraph-image.tsx
├── not-found.tsx           # or global-not-found.tsx with multiple root layouts
├── global-error.tsx
├── feed.xml/route.ts       # sites with a blog
├── llms.txt/route.ts       # optional, see answer-engines.md
└── blog/[slug]/
    ├── page.tsx            # generateMetadata + JsonLd
    └── opengraph-image.tsx

proxy.ts                    # slug existence checks, CSP nonces, Accept negotiation, per-request capture
instrumentation-client.ts   # analytics SDK init, before hydration
next.config.ts              # redirects(), headers(), deploymentId
components/json-ld.tsx
lib/site.ts                 # siteUrl, stable @id constants, createPageMetadata helper
lib/og-assets/              # TTF cuts for ImageResponse
public/.well-known/security.txt
```
