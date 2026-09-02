# Next.js SEO Implementation

App Router patterns, checked against the Next.js 16.3.0 docs bundled at `node_modules/next/dist/docs/` (September 2026) and against two production sites. Where behaviour changed in 16 (Proxy, Cache Components, promised `params` and `id`) the note says so, because most of the sites this skill touches are mid-upgrade. When in doubt, the bundled doc for the installed version wins over this file; where this file disagrees with a doc on purpose it says so and names the test.

## Contents

- [Metadata](#metadata)
- [How metadata merges](#how-metadata-merges)
- [Sites under a basePath](#sites-under-a-basepath)
- [Sitemap and robots](#sitemap-and-robots)
- [Feed](#feed)
- [Redirects and canonical host](#redirects-and-canonical-host)
- [Moving domains](#moving-domains)
- [Indexing policy](#indexing-policy)
- [404 and status codes under streaming](#404-and-status-codes-under-streaming)
- [Structured data](#structured-data)
- [OG images](#og-images)
- [Route handlers under Cache Components](#route-handlers-under-cache-components)
- [Core Web Vitals in Next.js](#core-web-vitals-in-nextjs)
- [IndexNow](#indexnow)
- [Security headers and CSP](#security-headers-and-csp)
- [Manifest](#manifest)
- [File structure](#file-structure)

## Metadata

Set `metadataBase` once in the root layout so every URL-based field below it can be relative. A relative `openGraph.images` or `alternates.canonical` with no `metadataBase` is a build error. Set the Google preview caps, attribution, and verification tokens there too; a page never needs to repeat them.

```tsx
// app/layout.tsx
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  // Home sets `title: { absolute }` to the full 50-60 character string; inner
  // routes get " | Brand" appended, so their titles stay at or under 44.
  title: { default: 'Brand', template: '%s | Brand' },
  // Third person, name-led. A spoken first-person lede on the home page is a
  // different string; do not reuse it for meta, OG, RSS, or JSON-LD.
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
  verification: { google: '...' }, // Search Console; `yandex` and `other` for the rest
  openGraph: { type: 'website', siteName: 'Brand', locale: 'en_US' },
  // Only `card` and `creator` here. A title or description in the root twitter
  // block is inherited verbatim by every inner page that declares no twitter
  // block, so /support would share as the home page.
  twitter: { card: 'summary_large_image', creator: '@brand' },
}

export const viewport: Viewport = {
  themeColor: [
    { color: '#fff', media: '(prefers-color-scheme: light)' },
    { color: '#0f0f0f', media: '(prefers-color-scheme: dark)' },
  ],
}
```

Most sites end up with a `createPageMetadata({ title, description, url, type, article, robots, useDefaultOgImage })` helper in `lib/site.ts` that every page calls. Three guards belong in it: build the social title as `title.includes(siteName) ? title : \`${title} | ${siteName}\`` so `og:title` never double-suffixes; spread `robots` only when given (`...(robots ? { robots } : {})`), because an `undefined` key is still a declaration; and let a route with a colocated `opengraph-image` file pass `useDefaultOgImage: false`, otherwise the helper's fallback image and the file convention both emit and the page carries two `og:image` tags. A per-post `seoTitle` frontmatter field lets `<title>` target the query while the visible headline stays editorial.

```tsx
// app/blog/[slug]/page.tsx: params is a Promise (Next.js 15+)
export async function generateMetadata(
  { params }: PageProps<'/blog/[slug]'>
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug) // wrap in React `cache()` so the page reuses it
  if (!post) return {}            // the existence check in proxy.ts sets the status
  return createPageMetadata({
    title: post.seoTitle ?? post.title,
    description: post.excerpt,
    url: `/blog/${slug}`,
    type: 'article',
    article: { publishedTime: post.publishedAt, modifiedTime: post.updatedAt, authors: ['https://example.com/about'] },
    useDefaultOgImage: false, // app/blog/[slug]/opengraph-image.tsx owns the card
  })
}
```

`PageProps<'/blog/[slug]'>` is a global helper Next.js generates during `next dev`, `next build`, or `next typegen`; it types `params` and `searchParams` without an import. Viewport, `themeColor`, and `colorScheme` moved to the `viewport` export in Next.js 14; putting them in `metadata` is deprecated.

**Streaming metadata.** When `generateMetadata` does request-time work, Next.js streams the page and appends the metadata tags to `<body>` for JavaScript-capable clients, and blocks to put them in `<head>` only for user agents in its HTML-limited bot list (`facebookexternalhit`, `Twitterbot`, `Slackbot`, `Bingbot`, and similar). Googlebot renders the DOM and reads either placement. `curl` is not on the list, so a raw `curl` check may find `<link rel="canonical">` in the body; pass `-A Twitterbot` to see the blocking form. Prerendered pages never stream metadata. Set `htmlLimitedBots: /.*/` in `next.config.ts` only if a downstream consumer needs head placement for every request; it costs TTFB.

**Crawlers under Cache Components.** Those same HTML-limited bots do not get the prerendered shell at all: Next.js detects them by user agent, skips the shell, renders the whole page dynamically at request time, and sends the finished HTML. Work that ran at build time runs again in the deployed function for every crawler hit, so a shell that reads a file the deployment does not ship, or an env var only the build had, renders for a person and fails for a crawler. Keep the shell's inputs reachable at request time and test each filesystem-reading route with `curl -A Twitterbot`.

**Cache Components** (`cacheComponents: true`, the `scaffold-nextjs` default). `generateMetadata` follows component rules. External data that is not request-bound goes behind `'use cache'` inside the function; leave `metadataBase` in the static root `metadata` export, since a cached function must return serialisable values and a `URL` instance is not one. Reading runtime data (`cookies()`, `headers()`, `params`, `searchParams`) while the rest of the page is prerenderable raises `blocking-prerender-metadata-runtime`, and an uncached fetch raises `blocking-prerender-metadata-dynamic`; the fix is either `'use cache'` or a `<Suspense>`-wrapped component that awaits `connection()` so the page declares its dynamic content intentionally.

## How metadata merges

Metadata is evaluated root layout first, then each nested layout, then the page, and the objects are **shallowly** merged. A scalar (`title`, `description`, `authors`) from a child replaces the parent's scalar. An object (`openGraph`, `twitter`, `robots`, `alternates`, `icons`) from a child replaces the parent's whole object; nothing inside it is inherited. `viewport` is the exception: its exports merge key by key. The two behaviours are indistinguishable in source, which is why none of this shows up in review. Consequences, each of which has shipped:

- A page that declares `openGraph: { title }` loses `siteName`, `images`, `locale`, and `type` from the root. Restate them, or spread a shared object (`openGraph: { ...sharedOpenGraph, title }`) from a `lib/site.ts` helper.
- `images: undefined` (or `robots: undefined`) is itself a declaration. Build the object conditionally and spread it, so the key is genuinely absent when you mean "inherit".
- A file-convention image (`opengraph-image.*`) attaches to the segment its file sits in, which is the root layout's. A deeper segment that declares its own `openGraph` block drops the inherited card; declare `images` explicitly there. The self-check: your explicit value should equal the URL Next injects on a page that declares no `openGraph`, minus its cache-busting hash.
- `title.template` applies to `<title>` only. `og:title` and `twitter:title` resolve against `openGraph.title.template` and `twitter.title.template`, tracked separately (Next's resolver keeps three title templates). Removing a hand-rolled suffix from a page title fixes `<title>` and silently strips the product from the card; set all three templates in the layout when inner titles are bare. The inverse trap: explicit titles that already carry the product, plus a template, produce `Install: Acme | Acme`.
- A bare string `title` in a nested layout resets the inherited template to null for that subtree. Return `{ default, template }` from nested layouts.
- Never set `openGraph.url` in a root layout; it is not per-page, and a child cannot override it without declaring `openGraph` and losing the rest. `alternates.canonical` is already per-page, and consumers fall back to the fetched URL.
- A `twitter` block in the root with `title` and `description` is inherited verbatim by every route that declares no `twitter`, so inner pages share as the home page. Keep only `card` and `creator` there; Next fills the Twitter title, description, and images from Open Graph when the page does not set them.
- Explicit `metadata.icons` beside file-convention icons (`favicon.ico`, `icon.svg`, `apple-icon.png` in `app/`) is dead weight at best and a duplicate `<link>` at worst. File-based metadata wins; delete the block.

The screening question is not "does the home page look right" but "does a route that inherits from the root layout look right, and does any route declare its own `openGraph` or `twitter` while relying on something inherited". Sample three inner routes from the sitemap, spread across sections, and read `og:site_name`, `og:image`, and `twitter:creator` out of the built HTML.

## Sites under a basePath

A site served under a path prefix (`basePath: '/tool'`, typically because a host site proxies it with a `beforeFiles` rewrite) is the same origin as the host. Links between them are internal: same tab, no `rel="noopener noreferrer"`, and never `next/link` for a path the other app owns, because it would prefetch an RSC payload that app cannot serve and hard-navigate anyway. Canonicals and sitemap URLs use the host URL, never the origin hostname behind the rewrite. Structured data references the host's `#person`, `#website`, and `#organization` ids by `@id` and never redefines them; a second `#website` on one domain is a second site.

What `basePath` prefixes for you: `next/link`, route handlers, relative `alternates.canonical` and `openGraph.url`, static `app/opengraph-image.png`, and `proxy.ts` matchers. What it does not: raw `<a href>`, `<img src>`, `next/image` `src` (contrary to the usual assumption), CSS `url(/...)`, `fetch('/api/...')`, `new URL('/x', request.url)`, `Link:` header values, manifest icon paths, and generated `opengraph-image.tsx` routes. Keep the prefix in one exported constant, wrap raw paths in an `asset(path)` helper, and import that constant into `next.config.ts` with a relative path: Next compiles the config without `tsconfig` path resolution, so an `@/` alias there resolves against the wrong directory.

Two consequences that only a build reveals. `metadataBase.pathname` is joined onto every relative field, so a `metadataBase` that includes the prefix doubles it on anything Next already prefixed; the self-consistent pairs are generated card plus prefixed `metadataBase` plus absolute canonicals, or static PNG plus bare-origin `metadataBase` plus relative canonicals. And a relative root canonical (`canonical: '/'`) resolves to a trailing-slash variant that does not exactly match the redirect target the old host points at; use the full absolute URL for the root canonical.

## Sitemap and robots

Google ignores `<priority>` and `<changefreq>` and uses `<lastmod>` only when it is "consistently and verifiably accurate", so emit `url`, `lastModified`, and `alternates.languages`, and skip the rest. `lastModified: new Date()` on every row teaches Google to distrust the field sitewide, and so does a bulk-migration date stamped on every imported post; when content has no real edit date, take it from the git log of the source file or leave the row without one.

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

Hub rows (homepage, `/blog`) take the freshest child date, so they move when content moves and stay put when it does not. Pages that are deliberately `noindex` (a thin utility page) stay out of the sitemap, with a comment saying so. Every sitemap URL needs an internal link, and not only a sitewide footer link: Google discounts footer boilerplate heavily, and one site watched a whole section sit at "URL is unknown to Google" for months while a nav-linked page beside it was crawled daily. Promote the section into the primary navigation and check coverage before demoting it again.

**Caching.** `sitemap.ts` is a Route Handler cached by default. Without Cache Components, `export const revalidate = 3600` keeps it fresh on a site that publishes often. With `cacheComponents: true` that export fails the build (so do `dynamic`, `dynamicParams`, and `fetchCache`); move the data call into a helper marked `'use cache'` with `cacheLife('hours')` and `cacheTag('posts')`, then `revalidateTag('posts', 'max')` from the publish webhook. Revalidation refreshes Next's cache only; a CDN in front of the app keeps serving the old body until you purge it in the same webhook.

**Over 50,000 URLs or 50 MB, or several sources.** Export `generateSitemaps()` returning `[{ id: 0 }, { id: 1 }, ...]`; the default function receives `id` as `Promise<string>` (Next.js 16; a plain number before). Files are served at `/<segment>/sitemap/<id>.xml`, for example `app/product/sitemap.ts` yields `/product/sitemap/0.xml`. Next.js does not write a sitemap index. Either list every generated file in `robots.ts` (`sitemap` accepts an array) or hand-write the index yourself: a route handler at `app/sitemap.xml/route.ts` returning a `<sitemapindex>` that points at `sitemap-main.xml` and each other file keeps `/sitemap.xml` the single URL to submit to Search Console, and `robots.ts` lists that one URL only. Escape every `<loc>` (`&`, `<`, `>`, quotes), and list a child sitemap only after confirming it answers with XML; a proxied app whose server returns its SPA `index.html` for `/sitemap.xml` hands Search Console HTML where it expects XML. Repeating the children in `robots.ts` double-advertises them.

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

Per-crawler rules for AI agents and the `Content-Signal` line are in `answer-engines.md`. A `Disallow` does not keep a URL out of results (Google may index it without content), so a page that must stay out needs `noindex`.

## Feed

A blog ships `app/feed.xml/route.ts` and advertises it through `alternates.types` in the root metadata. Four details decide whether readers and syndication tools accept it:

- `<lastBuildDate>` is the newest edit anywhere in the archive, not the newest publication; a two-year-old post revised today should move the feed.
- `<guid isPermaLink="false">` with a stable id, and `<atom:link rel="self">` pointing at the feed's own URL.
- Body HTML goes in `<content:encoded>` inside CDATA, with any literal `]]>` split as `]]]]><![CDATA[>`; everything else is XML-escaped.
- Root-relative `href` and `src` values are absolutised before serialising: a feed reader resolves them against its own origin and 404s. Fragment links stay as they are; raw HTML blocks are dropped for syndication.

`Cache-Control: public, max-age=3600` on the response is enough; the handler is prerendered like the sitemap, so the same `'use cache'` rules apply.

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
      // A pre-rename slug the catch-all would send to a 404. Search Console
      // counts a redirect that lands on a 404 as "Not found", so every
      // destination must answer 200.
      { source: '/blog/topic/old-name', destination: '/writing/topic/new-name', permanent: true },
      { source: '/blog/:path*', destination: '/writing/:path*', permanent: true },
      {
        // Query form of an old URL: `has` matches the parameter and captures it.
        source: '/item',
        has: [{ type: 'query', key: 'id', value: '(?<id>[^&]+)' }],
        destination: '/post/:id',
        permanent: true,
      },
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

Rules match in array order, and `:path*` swallows every URL beneath it, so anything more specific has to sit above the catch-all or it becomes dead code. A renamed slug that would otherwise chain (`/old/x` to `/new/x` to `/new/y`) gets its own entry above the wildcard so it resolves in one hop. Alternate hosts need the specific rules repeated with a `has: [{ type: 'host' }]` clause, or a visitor on the old host takes one hop to the apex and a second to the new path; generate them with a `flatMap` over the host list, and keep query-conditioned rules out of that spread, since it replaces `has` and leaves the captured parameter unresolvable. A retired section whose routes have no equivalent collapses to one destination on purpose; preserving the path would only trade a redirect for a 404. Prefix rules that could collide with filenames (`/tool` against `/tool-mono.woff2`) are written as two entries, `/tool` and `/tool/:path*`, never as `/tool:path*`. Vercel caps `redirects()` at 1,024 entries; beyond that, keep the map in Proxy (a Bloom filter over a JSON map is the documented pattern).

Some redirects are load-bearing for consumers that cannot re-read anything: an old path sitting in sent email, in the `homepage` of every published npm tarball, in a shadcn registry URL inside other projects' `components.json` (the CLI resolves it at install time with no fallback), or in a partner's `llms.txt`. Comment those with what depends on them, and inventory the comments before deleting a rule. Redirects and rewrites are compiled into `.next/routes-manifest.json` at `next build`; an env var that shapes them must be set on the build, not on `next start`, and a rewrite whose origin is unreachable turns a harmless 404 into a 502.

If the platform already redirects at the edge (a Vercel domain redirect, a Cloudflare rule), set the 308 there and delete the config rule; two layers produce a chain. Inside a Server Component, `permanentRedirect()` is 308 and `redirect()` is 307 (303 for a progressive-enhancement form submission). Both throw, so call them outside `try/catch`, and both degrade to a client-side `<meta>` redirect on a 200 once streaming has started, which under Cache Components is every dynamic route; a permanent move never belongs inside a page. A retired subdomain that stays attached to the project needs its redirect in `next.config.ts` with `basePath: false`; a DNS-only zone never passes through a CDN rule, and a host-conditional rule is inert until the host is attached to the project, answering with the platform's own 404 in the meantime.

**Proxy replaces middleware.** Next.js 16 renamed `middleware.ts` to `proxy.ts` and the export to `proxy`; the old name still runs but is deprecated, and `skipMiddlewareUrlNormalize` became `skipProxyUrlNormalize`. `npx @next/codemod@canary middleware-to-proxy .` does the rename. Proxy runs on the Node.js runtime only and the `runtime` export is an error there. Execution order: `headers()`, then `redirects()`, then Proxy, then `beforeFiles` rewrites, the filesystem, `afterFiles`, dynamic routes, and `fallback`. Without a `matcher` Proxy runs on every request including `_next/static` and `public/` assets; use the documented negative lookahead, exclude the metadata files, and add each literal path you rewrite. Matchers compile to end-anchored regexes, so `/about` matches only `/about` (the docs' matcher page says otherwise; the regex from `getMiddlewareMatchers` in 16.3.0 ends in `[\/#\?]?$`).

## Moving domains

A domain move is a Search Console "Change of address" plus a 308 from every old URL to its new home, and Google holds the migration open for 180 days. During that window nothing may be torn down: the old host must keep resolving and redirecting, and every destination must keep answering 200, because a move whose target 404s loses everything the old host had. Audit coverage from each source property, not the destination; the destination's report undercounts.

On Vercel, detaching a domain from a project revokes its verification, and re-adding it issues a fresh `_vercel` TXT challenge with a new value; the host serves `404 DEPLOYMENT_NOT_FOUND` until DNS catches up. Order of operations for moving a host between projects: add it to the destination project, read the new `verification[].value`, write the TXT record, then detach from the source, then verify. Retiring a subdomain that should redirect: attach it to the surviving project, deploy the host-conditional redirect, wait out the old CNAME's TTL, and only then delete the source project. Never assume `<name>.vercel.app` belongs to the project; the namespace is global and first-come.

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

Vercel already adds `X-Robots-Tag: noindex` to every preview deployment and to the previous production deployment after a promotion. It omits the header when a custom domain is attached to a non-production branch (`staging.example.com`), so those environments need the header above. Do not put that header on an origin that another site reaches through a rewrite: the proxying fetch carries it back out and de-indexes the public URL. The canonical does that job.

Canonical and `noindex` do different jobs. A preview or staging URL is `noindex`. A duplicate that should consolidate onto the real page (trailing-slash variant, tracking-parameter URL, syndicated copy, a filtered view of a list) gets `rel="canonical"` and stays indexable; Google says it does "not recommend using noindex to prevent selection of a canonical page within a single site", and a `noindex` page passes nothing to its canonical target. Do not use `robots.txt` for canonicalisation either: disallowed URLs can still be indexed without content.

## 404 and status codes under streaming

`notFound()` returns a real 404 only if it runs before the response starts streaming. Once a Suspense boundary (including `loading.tsx`) has flushed, the 200 header is already sent, so Next.js streams the not-found UI with `<meta name="robots" content="noindex">` instead. Google does not index those, but Search Console lists them as soft 404s and analytics sees a 200.

Rules that keep the status honest:

- Without Cache Components, call `notFound()` before the first `await` that can suspend and before any `<Suspense>` in the segment. `generateMetadata` may call it too.
- With Cache Components, every dynamic route streams a static shell first, so the docs are explicit: run the existence check in `proxy.ts` (a fast lookup against a slug list or a key-value store, not a content fetch) and return a 404 `Response` or rewrite to the not-found route. `notFound()` inside the page still keeps the soft 404 out of the index; it cannot change the status.
- Apps with multiple root layouts or a top-level `[locale]` segment use `app/global-not-found.tsx` (`experimental.globalNotFound: true`), which bypasses rendering and returns 404 for unmatched URLs. It must return a full document, and it imports its own styles and fonts.
- Next.js injects the `noindex` meta on every real 404 itself, `global-not-found` included, so `robots` on the 404 page is redundant. Give it a few recovery links (sitemap, the main archive, `llms.txt`) and say in the copy that it is a real 404; agents read that line.

`error.tsx` renders inside an already-started response as well, so a data failure on an indexable page ships as 200 with error copy. Fail loudly in the data layer (throw before render, or `notFound()` for a missing record) rather than relying on the boundary for status. `app/global-error.tsx` is the fallback for the root layout itself: it renders without the layout's stylesheet, so its styles are inline, and after a deploy the common failure is a `ChunkLoadError` whose only fix is a reload. Detect it and reload in an effect on mount; `deploymentId` in `next.config.ts` prevents most of those.

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

Every claim in the JSON-LD must be verifiable in the served HTML. Google calls markup for content a user cannot see a structured-data policy violation, and answer engines quote the DOM, so a `FAQPage` whose answers never render, a `description` fed only to schema, or a `BreadcrumbList` naming a crumb the visible trail lacks is a defect. Copy that only reaches JSON-LD (`SpeakingEntry.highlights`, `CaseStudy.outcome`) is the usual source; check the card component before authoring new fields, and derive schema values from the same data the page renders (`jobTitle: experience[0].jobTitle`, contact facts from one module) so the two cannot drift. Emit one `@graph` per page, not N scripts: disconnected nodes cannot be merged into one entity, and the RSC payload repeats the escaped string, so count `<script` tags rather than grepping for `ld+json`. Keep list markup short: an `ItemList` carries `name` and `url` per entry, and duplicating card copy into it is how one site earned an "HTML size is too large" warning.

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
      logo: 'https://example.com/web-app-manifest-512x512.png', sameAs: ['https://www.linkedin.com/company/...'] },
    { '@type': 'WebSite', '@id': websiteId, name: 'Brand', url: 'https://example.com', publisher: { '@id': orgId } },
    { '@type': 'Person', '@id': personId, name: 'Author Name', url: 'https://example.com/about',
      worksFor: { '@id': orgId }, sameAs: ['https://github.com/...'] },
  ],
}} />
```

`sameAs` on a `Person` lists profiles of the same person (GitHub, LinkedIn, X). Employer, product, and investor URLs describe organisations and go through `worksFor`, `affiliation`, or `memberOf`; listing them in `sameAs` conflates the person with those entities, and an `alternateName` on an Organization that equals a person's full name merges the two.

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

Fill recommended fields, not only required ones: Search Console reports missing recommended fields as rich-result warnings (an `Event` wants `endDate`, `offers`, `image`, `eventStatus`, `eventAttendanceMode`, a full `PostalAddress`, and `organizer.url`; an `Offer` needs `availability` to be usable at all and a numeric `price`, since `"0"` is read as a currency-formatted literal). Never claim a type the page does not show: a typeface is a `CreativeWork`, not a `SoftwareApplication`, and `SoftwareApplication` needs `offers` plus a rating or review for its rich result, which self-authored reviews cannot supply. Types Google has dropped from rich results and should not be added for that reason: `FAQPage` (May 2026), `HowTo` (2023), Book Actions, Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing (June 2025), Practice Problem (January 2026). Product, Review, Article, Recipe, Video, Organization, LocalBusiness, BreadcrumbList, and ProfilePage still produce results.

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
// Satori reads TTF, OTF, and WOFF (TTF or OTF is fastest); a woff2 throws
// "Unsupported OpenType signature", a hard error rather than a fallback.
const font = await readFile(join(process.cwd(), 'lib/og-assets/brand-600.ttf'))

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  const fontSize = post.title.length > 44 ? 72 : post.title.length > 28 ? 88 : 108
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  padding: 80, background: '#fdc5d7', color: '#e8391c', fontFamily: 'Brand', fontSize, fontWeight: 600 }}>
      {post.title}
    </div>,
    { ...size, fonts: [{ name: 'Brand', data: font, style: 'normal', weight: 600 }] },
  )
}
```

Satori supports flexbox and a CSS subset only: no `display: grid`, no `oklch()`, no CSS variables, so colours are hand-synced sRGB literals, and the card renders light regardless of the site's dark mode, because the feed that embeds it has no idea what the reader's OS is set to. Raster assets are read at module scope and embedded as base64 data URIs (JPEG decodes most reliably), font files are static cuts subset to the characters the card can show, and the whole bundle (JSX, CSS, fonts, images) must stay under 500 KB. File-based images (`opengraph-image.png` plus `opengraph-image.alt.txt`) need no code and cannot drift from the meta tags. Generated images are statically optimised unless they read request data. `twitter-image` falls back to the OG image when absent (the metadata resolver fills the Twitter card from Open Graph), so a separate byte-identical file is redundant; the file limits are 8 MB (OG) and 5 MB (Twitter) and exceeding them fails the build.

Facts that only show up in built output:

- `app/opengraph-image.tsx` serves at `/opengraph-image`. `/opengraph-image.png` is a 404, so an explicit `openGraph.images` entry must not carry the extension.
- Under a `basePath`, Next prefixes the static `app/opengraph-image.png` URL with the base path and leaves a generated route unprefixed; `metadataBase.pathname` is then joined on top of both, following the documented composition rule that treats an absolute field path as relative to the base. Two fixes for a doubled static card: an explicit `openGraph.images` value outranks the file convention, and moving the PNG into `public/` (which serves under the prefix) puts the prefix back in one place. Do both.
- Verify against `next build` output, never `next dev`, which rewrites `metadataBase` to the dev origin and reports the opposite of production on exactly these questions.

When recompressing `public/` assets for CWV, keep filenames and formats so references stay valid. An avatar reused as the `Person` `image` is served to crawlers too, so its size matters twice.

## Route handlers under Cache Components

`sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`, and any `route.ts` that reads no request data are prerendered at build time and served static until their cache revalidates. Consequences:

- The `dynamic`, `dynamicParams`, `revalidate`, and `fetchCache` segment configs fail the build; `runtime`, `maxDuration`, `instant`, and `prefetch` remain. Freshness comes from `'use cache'` plus `cacheLife` on a helper the `GET` calls; the directive cannot sit on the `GET` export itself.
- Reading uncached or runtime data in a `GET` bails out of prerendering by throwing. A `try/catch` around the handler body catches that bail-out and, if it logs, adds a stack trace per handler to the build output. Set `experimental.hideLogsAfterAbort: true`, or keep the `try/catch` narrow.
- Anything per-request (an analytics capture for `llms.txt` reads, a request counter) cannot live in the handler; it runs at build and on revalidation only. Put it in `proxy.ts` behind `event.waitUntil()` or `after()` so it stays off the response path, and read the `Host` header rather than `nextUrl.host` for any local-host guard, since dev normalises `nextUrl` to the server's own origin.
- Set cache headers deliberately: `public, max-age=3600` on discovery documents, `no-store` on anything that answers a POST, and `CDN-Cache-Control` with `s-maxage` plus `stale-while-revalidate` on a dynamic handler the CDN may hold.

## Core Web Vitals in Next.js

- The LCP element stays outside or above every `<Suspense>` boundary; a hero inside a boundary paints after the shell. Size skeleton fallbacks to the content they replace, or the swap counts as layout shift.
- `next/image` deprecated `priority` in 16 in favour of `preload`. For the hero, `loading="eager"` or `fetchPriority="high"` is the documented first choice; `preload` is for the one image that must start before the parser reaches it.
- `next/font/local`: `display: 'swap'` (`optional` drops the real font whenever it is not already cached within the browser's short window); `adjustFontFallback` set to a fallback of the same class, so a serif display face swaps serif to serif; `preload` is all-or-nothing per family, so a family carrying an italic the hero never uses is better left unpreloaded; declare `weight` to the range the design uses; `src` paths are literal, never computed.
- Filters on an indexable list live in path segments, not `searchParams`: reading search params opts the route out of static rendering and, under Cache Components, ships the list twice through the RSC stream. Redirect the query form with a `has: [{ type: 'query' }]` rule.
- Field data: a small `'use client'` component calling `useReportWebVitals`, mounted from the root layout, sends LCP, INP, and CLS to the analytics SDK that `instrumentation-client.ts` initialised. Lighthouse is a lab run; report both.
- Behind nginx or another buffering proxy, streaming needs `X-Accel-Buffering: no` on the response or the shell arrives with the rest.

## IndexNow

Bing, Yandex, Naver, and Seznam accept push notifications of changed URLs through IndexNow; Google does not participate. Two pieces: a key file served at `https://example.com/<key>.txt` whose body is the key (a `public/` file, or a route handler behind an `afterFiles` rewrite of `/:key.txt` so `robots.txt` and `llms.txt` still win first), and a `POST` to `https://api.indexnow.org/indexnow` with `{ host, key, keyLocation, urlList }` from the publish webhook or a deploy hook. Up to 10,000 URLs per call. Derive `urlList` from the same source as the sitemap, and never submit a URL that `next.config.ts` redirects: a redirecting URL in a submission works against the consolidation the redirect exists for. Keep the submit endpoint behind a bearer secret.

## Security headers and CSP

Static headers go in `next.config.ts`. Every matching rule applies in array order and, per header key, the last value wins, so the catch-all comes first and per-route exceptions after it. Add `poweredByHeader: false` beside them; Next.js emits `x-powered-by` by default.

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
        // An analytics SDK that lazy-loads its own chunks and compresses in a
        // worker needs its origin in script-src and connect-src, plus
        // worker-src blob:. An embedded booking or captcha widget needs
        // connect-src and frame-src as well. Every third party you promote
        // from report-only to enforced without its directives stops loading
        // silently.
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://analytics.example.com; connect-src 'self' https://analytics.example.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests" },
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

Use `/:path*` rather than `/(.*)` as the catch-all source. Next prefixes `basePath` onto the source, and `/zone/(.*)` needs a separator after the prefix, so it misses the zone root itself; `/:path*` matches it. When the site proxies another app under a prefix, exclude that prefix with a segment-anchored pattern (`(?:/|$)`) so `/tool-mono.woff2` still gets headers while `/tool` and `/tool/install` do not, and let the proxied app own its headers: two `Content-Security-Policy` headers on one response are intersected by the browser, not overridden. In development add `'unsafe-eval'` to `script-src` (React uses `eval` there to rebuild server error stacks); production must not carry it. Roll a new policy out as `Content-Security-Policy-Report-Only` first, keeping an enforced `frame-ancestors 'none'` in the meantime, and read the violation reports before switching.

A nonce-based CSP (`script-src 'nonce-...' 'strict-dynamic'`) needs a fresh nonce per request, which means generating it in `proxy.ts`, forwarding it as an `x-nonce` request header, and rendering every page dynamically: static generation, ISR, and the Partial Prerendering shell all stop applying, and the docs mark PPR incompatible with nonces outright. The proxy matcher for it excludes `_next/static`, `_next/image`, the metadata files, and prefetch requests. Take that trade only when compliance forbids `'unsafe-inline'`; otherwise the static header above, or the experimental build-time SRI (`experimental.sri.algorithm: 'sha256'`), keeps pages prerenderable. Values and the HSTS ramp: `technical-hardening.md`.

## Manifest

A `manifest.json` or `manifest.webmanifest` in the root of `app/` is a file convention: Next serves it and injects `<link rel="manifest">` by itself, so the static file a favicon generator emits needs no `metadata.manifest` entry (that field is for a manifest hosted elsewhere). Generate it only when a value depends on data:

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
├── layout.tsx              # metadataBase, title templates, robots caps, verification, shared @graph
├── sitemap.ts              # or sitemap.xml/route.ts as a hand-written index
├── robots.ts
├── manifest.json           # from the favicon generator, or manifest.ts
├── favicon.ico, icon0.svg, icon1.png, apple-icon.png
├── opengraph-image.png + opengraph-image.alt.txt   # or opengraph-image.tsx
├── not-found.tsx           # or global-not-found.tsx with multiple root layouts
├── global-error.tsx        # inline styles; reloads on ChunkLoadError
├── feed.xml/route.ts       # sites with a blog
├── llms.txt/route.ts       # optional, see answer-engines.md
├── .well-known/<name>/route.ts   # discovery documents, see answer-engines.md
└── blog/[slug]/
    ├── page.tsx            # generateMetadata + JsonLd
    └── opengraph-image.tsx

proxy.ts                    # existence checks for 404s, CSP nonces, Accept negotiation, per-request capture
instrumentation-client.ts   # analytics SDK init, before hydration
next.config.ts              # redirects(), headers(), deploymentId, poweredByHeader
components/json-ld.tsx
lib/site.ts                 # siteUrl, stable @id constants, createPageMetadata helper
lib/og-assets/              # TTF cuts for ImageResponse
public/.well-known/security.txt
```

Adding an indexable page touches more than `page.tsx`: its metadata and JSON-LD, a data module if the copy is shared with a Markdown builder, that builder plus the full-corpus builder (the per-page route keeps working while `llms-full.txt` silently omits the page), the `proxy.ts` path list and matcher (miss one and `.md` falls through to HTML), the sitemap, and a link from the header or footer navigation. Write the list down in `AGENTS.md`; every one of those has been forgotten once.
