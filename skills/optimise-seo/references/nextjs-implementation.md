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

For sites over 50,000 URLs (or to split by type), return a sitemap **index** by exporting `generateSitemaps()` and reading the `id`; Next.js serves `/sitemap/0.xml`, `/sitemap/1.xml`, … under one index. Add image/video entries with the `images`/`videos` fields on a sitemap row when media is JS-loaded or CDN-hosted and not reachable by link-following.

## Redirects, headers, and indexing

```ts
// next.config.ts: permanent (308) vs temporary (307). Avoid redirect chains.
const config = {
  async redirects() {
    return [
      { source: '/old-path', destination: '/new-path', permanent: true },   // 308
      { source: '/promo', destination: '/sale', permanent: false },          // 307
    ]
  },
}
```

Indexing policy: public pages default to `index, follow`. Mark staging, admin, thin, or private pages explicitly, via `metadata.robots` for HTML routes, or `X-Robots-Tag` for non-HTML (PDFs, APIs) and whole environments.

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

Note: `JSON.stringify` on schema objects produces safe output (no user-supplied HTML).

```tsx
// app/layout.tsx: Organization & WebSite
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Brand',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
}} />

<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Brand',
  url: 'https://example.com',
}} />
```

```tsx
// Breadcrumbs
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
// Article
<JsonLd data={{
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  image: [post.image],
  datePublished: post.publishedAt,
  author: { '@type': 'Person', name: post.author },
}} />
```

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
