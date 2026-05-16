# Markdown Delivery Implementation

## Contents

- Content negotiation via Accept header
- .md URL endpoints
- Next.js implementation
- Cloudflare implementation
- Caching considerations
- Testing

## Content Negotiation via Accept Header

When a request includes `Accept: text/markdown`, serve the same content as clean markdown instead of HTML. This reduces token consumption by ~80%.

Response requirements:
- `Content-Type: text/markdown`
- `Vary: Accept` (required — prevents CDN cache poisoning)
- `X-Robots-Tag: noindex, nofollow` (prevents search engine indexing of markdown variant)

## .md URL Endpoints

Append `.md` to any page URL to get the markdown version:
- `/docs/api` → HTML
- `/docs/api.md` → Markdown

Caveat: conflicts with user-generated URL spaces where slugs end in `.md`. Use content negotiation instead for those routes.

## Next.js Implementation

### Middleware approach (content negotiation)

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accept = request.headers.get('accept') || '';
  const isMarkdownRequest = accept.includes('text/markdown');

  if (isMarkdownRequest && request.nextUrl.pathname.startsWith('/docs')) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/markdown${request.nextUrl.pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('Content-Type', 'text/markdown');
    response.headers.set('Vary', 'Accept');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  const response = NextResponse.next();
  response.headers.set(
    'Link',
    '</llms.txt>; rel="llms-txt", </llms-full.txt>; rel="llms-full-txt"'
  );
  response.headers.set('X-Llms-Txt', '/llms.txt');
  return response;
}
```

### .md URL rewrites

```ts
// next.config.ts
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/docs/:path*.md',
        destination: '/api/markdown/docs/:path*',
      },
    ];
  },
};
```

### Markdown API route

```ts
// app/api/markdown/[...path]/route.ts
import { getPageContent } from '@/lib/docs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const slug = path.join('/');
  const markdown = await getPageContent(slug);

  if (!markdown) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown',
      'Vary': 'Accept',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
```

## Cloudflare Implementation

Cloudflare offers automatic edge HTML-to-Markdown conversion (Pro+ plans). For Workers:

```ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const accept = request.headers.get('accept') || '';

    if (accept.includes('text/markdown')) {
      const htmlResponse = await fetch(request.url, {
        headers: { ...request.headers, Accept: 'text/html' },
      });
      const html = await htmlResponse.text();
      const markdown = htmlToMarkdown(html); // Use Turndown or similar

      return new Response(markdown, {
        headers: {
          'Content-Type': 'text/markdown',
          'Vary': 'Accept',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }

    return fetch(request);
  },
};
```

## Caching Considerations

- Always set `Vary: Accept` on negotiated responses
- Use `Cache-Control: public, max-age=3600` or shorter with `must-revalidate` and `ETag`
- CDN must respect `Vary` header — test that markdown and HTML are cached separately
- Set `max-age` under 3600 or use `must-revalidate` with `ETag` for cache hygiene

## Testing

```bash
# Test content negotiation
curl -H "Accept: text/markdown" https://example.com/docs/api

# Test .md URL
curl https://example.com/docs/api.md

# Verify Vary header
curl -I https://example.com/docs/api | grep -i vary

# Verify Link headers
curl -I https://example.com/ | grep -i "link\|x-llms"

# Compare content parity
diff <(curl -s -H "Accept: text/markdown" https://example.com/docs/api) \
     <(curl -s https://example.com/docs/api.md)
```
