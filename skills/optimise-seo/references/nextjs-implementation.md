# Next.js SEO Implementation

Patterns for Next.js App Router.

## Contents
- Metadata (static and dynamic)
- Sitemap and robots
- Redirects, headers, and indexing
- Internationalisation (hreflang)
- Security headers
- Manifest
- Structured data (JSON-LD)
- OG images
- File structure

## Metadata

```tsx
// app/page.tsx or app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title - Brand',
  description: 'Description 150-160 chars',
  openGraph: {
    title: 'Social Title',
    description: 'Social description',
    images: [{ url: 'https://example.com/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://example.com/twitter.png'],
  },
  alternates: { canonical: 'https://example.com/page' },
}
```

Dynamic metadata:
```tsx
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  return {
    title: `${post.title} - Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://example.com/blog/${slug}` },
  }
}
```

## Sitemap & Robots

```tsx
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  return [
    { url: 'https://example.com', lastModified: new Date(), priority: 1 },
    ...posts.map(p => ({
      url: `https://example.com/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      priority: 0.7,
    })),
  ]
}
```

```tsx
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

For >50,000 URLs (or to split by type), return a sitemap **index**: export `generateSitemaps()` and read the `id`; Next.js serves `/sitemap/0.xml`, `/sitemap/1.xml`, … under one index. Add image/video entries via the `images`/`videos` fields on a row when media is JS-loaded or CDN-hosted and not reachable by link-following.

Derive `lastModified` from the most recent content date (see the SKILL.md gotcha on stale dates). Index and homepage rows should reflect the freshest child item:

```ts
// app/sitemap.ts: freshest-content lastModified
function latestDate(dates: string[], fallback: Date): Date {
  const times = dates.map(d => new Date(d).getTime()).filter(t => !Number.isNaN(t))
  return times.length > 0 ? new Date(Math.max(...times)) : fallback
}

const latestBlog = latestDate(posts.map(p => p.updatedAt ?? p.publishedAt), buildDate)
// /blog index row uses latestBlog; the homepage row uses the freshest date
// across every content type (e.g. Math.max of latestBlog and latestStudy).
```

## Redirects, headers, and indexing

```ts
// next.config.ts: permanent (308) vs temporary (307). Avoid redirect chains.
const config = {
  async redirects() {
    return [
      { source: '/old-path', destination: '/new-path', permanent: true },   // 308
      { source: '/promo', destination: '/sale', permanent: false },          // 307
      {
        // Canonicalise www -> apex with a permanent (308) redirect, matched by host.
        source: '/:path*',
        has: [{ type: 'host', value: 'www.example.com' }],
        destination: 'https://example.com/:path*',
        permanent: true,
      },
    ]
  },
}
```

Pick one canonical host (apex or www) and 308 the other. If the platform already redirects at the edge (e.g. a Vercel domain redirect), set 308 there instead of duplicating the rule in `next.config.ts`.

Indexing policy: public pages default to `index, follow`. Mark staging, admin, thin, or private pages explicitly: `metadata.robots` for HTML routes, `X-Robots-Tag` for non-HTML (PDFs, APIs) and whole environments.

```tsx
// Per-page noindex
export const metadata: Metadata = { robots: { index: false, follow: false } }
```

```ts
// next.config.ts: X-Robots-Tag for non-HTML / staging
async headers() {
  return [{
    source: '/:path*',
    headers: [{ key: 'X-Robots-Tag', value: 'noindex' }], // staging only
  }]
}
```

## Internationalisation (hreflang)

```tsx
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; slug: string }> }
): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPost(slug, locale)
  return {
    title: post.title,              // translated per locale
    description: post.excerpt,      // translated per locale
    alternates: {
      canonical: `https://example.com/${locale}/blog/${slug}`,
      languages: {
        'en': `https://example.com/en/blog/${slug}`,
        'de': `https://example.com/de/blog/${slug}`,
        'x-default': `https://example.com/en/blog/${slug}`,
      },
    },
  }
}
```

## Security headers

```ts
// next.config.ts: applied to every HTML response
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: "default-src 'self'; frame-ancestors 'self'" },
    ],
  }]
}
```

See `technical-hardening.md` for values, CSP rollout, cookies, and `security.txt`.

## Manifest

```ts
// app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Brand',
    short_name: 'Brand',
    start_url: '/',
    display: 'standalone',
    theme_color: '#1e3a8a',
    background_color: '#ffffff',
    icons: [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  }
}
```

## Structured Data

```tsx
// components/JsonLd.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

Note: `JSON.stringify` on schema objects is safe (no user-supplied HTML).

**Entity graph.** Define each entity once with a stable `@id` and reference it by `@id` everywhere else, not duplicated inline. Emit shared entities once (homepage or root layout) inside a single `@graph`, then let per-page schema (Article, Breadcrumb, ProfilePage) point back by `@id`. Search engines then resolve one knowledge graph instead of disconnected snippets.

```tsx
// lib/site.ts: stable ids referenced everywhere
export const personId = 'https://example.com/#person'
export const websiteId = 'https://example.com/#website'
export const orgId = 'https://example.com/#organization'

// app/layout.tsx: emit shared entities once, interlinked
<JsonLd data={{
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Person', '@id': personId, name: 'Author Name',
      url: 'https://example.com', worksFor: { '@id': orgId },
      sameAs: ['https://www.linkedin.com/in/...', 'https://github.com/...'] },
    { '@type': 'Organization', '@id': orgId, name: 'Brand',
      url: 'https://example.com', logo: 'https://example.com/logo.png' },
    { '@type': 'WebSite', '@id': websiteId, name: 'Brand',
      url: 'https://example.com', publisher: { '@id': orgId } },
  ],
}} />
```

```tsx
// Breadcrumbs (per inner page)
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
}} />
```

```tsx
// Article: Person authors, Organization (with logo) publishes
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  image: [post.image],
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: { '@id': personId },
  publisher: { '@id': orgId },   // Organization + logo, not the Person
  isPartOf: { '@id': websiteId },
}} />
```

```tsx
// ProfilePage: identity pages (/about, /now) point at the Person
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://example.com/about#webpage',
  url: 'https://example.com/about',
  isPartOf: { '@id': websiteId },
  about: { '@id': personId },
  mainEntity: { '@id': personId },
}} />
```

Fill recommended fields, not just required ones: Search Console reports missing recommended fields as rich-result *warnings* (e.g. an `Event` wants `endDate`, `offers`, `image`, `eventStatus`, `eventAttendanceMode`, a full `PostalAddress`, and `organizer.url`). Validate each type against the Rich Results Test and clear enhancement-report warnings, not only errors.

## OG Images

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }

export default async function Image(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await getPost(slug)
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(to bottom, #1e3a8a, #3b82f6)',
      color: 'white', fontSize: 64, fontWeight: 'bold',
    }}>
      {post.title}
    </div>
  )
}
```

When recompressing `public/` assets for CWV, keep filenames and formats so references stay valid. An avatar reused as the `Person` JSON-LD `image` is served to crawlers too, so its size matters twice.

## File Structure

```
app/
├── layout.tsx          # Organization/WebSite schemas
├── sitemap.ts
├── robots.ts
├── manifest.ts
├── icon.svg
├── apple-icon.png
└── blog/[slug]/
    ├── page.tsx
    └── opengraph-image.tsx

components/
└── JsonLd.tsx

next.config.ts          # redirects(), headers(): security + X-Robots-Tag
public/.well-known/
└── security.txt
```
