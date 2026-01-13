# Next.js SEO Implementation

Essential patterns for Next.js 16 App Router.

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
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)
  return {
    title: `${post.title} - Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://example.com/blog/${params.slug}` },
  }
}
```

## Sitemap & Robots

```tsx
// app/sitemap.ts
import { MetadataRoute } from 'next'

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
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

## Structured Data

```tsx
// components/JsonLd.tsx
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

```tsx
// app/layout.tsx - Organization & WebSite
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

export default async function Image({ params }) {
  const post = await getPost(params.slug)
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

## Performance

```tsx
import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

// In layout
<html className={inter.className}>

// In components
<Image
  src="/hero.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={630}
  priority  // For LCP image
/>
```

## File Structure

```
app/
├── layout.tsx          # Organization/WebSite schemas
├── sitemap.ts
├── robots.ts
├── icon.svg
├── apple-icon.png
└── blog/[slug]/
    ├── page.tsx
    └── opengraph-image.tsx

components/
└── JsonLd.tsx
```

## Validation

```bash
npm install -g lighthouse
lighthouse https://site.com --output=json --output-path=report.json
cat report.json | jq '.categories.seo.score * 100'  # Target: 90+
```
