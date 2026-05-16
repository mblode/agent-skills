# llms.txt Implementation Guide

## Contents

- Format specification
- Creating llms.txt
- Creating llms-full.txt
- Auto-generation strategies
- Next.js implementation
- Cloudflare Workers implementation

## Format Specification

The file at `/llms.txt` is Markdown with this strict order:

1. **H1 heading** — project/site name (required, the only required element)
2. **Blockquote** — short summary with key context
3. **Body paragraphs/lists** — any markdown except headings
4. **H2 sections** — each contains a URL list: `- [Title](URL): Description`
5. **`## Optional`** — special section signaling skippable content

```markdown
# Example Site

> Developer platform for building real-time applications with WebSockets and event streams.

Example Site provides SDKs for JavaScript, Python, Go, and Rust. All APIs use REST with JSON payloads. Authentication uses API keys or OAuth 2.0.

## Docs
- [Getting Started](https://example.com/docs/start): Quick start guide for your first app
- [API Reference](https://example.com/docs/api): Full REST API documentation
- [SDKs](https://example.com/docs/sdks): Client libraries for all supported languages
- [Authentication](https://example.com/docs/auth): API keys and OAuth 2.0 setup

## Guides
- [WebSocket Streaming](https://example.com/guides/websockets): Real-time data streaming
- [Webhooks](https://example.com/guides/webhooks): Event delivery configuration

## Optional
- [Changelog](https://example.com/changelog): Release history
- [Blog](https://example.com/blog): Engineering blog posts
- [Status](https://status.example.com): Service status page
```

## Creating llms-full.txt

`/llms-full.txt` embeds the complete content of every page inline instead of linking:

```markdown
# Example Site — Full Documentation

> Complete documentation for Example Site.

## Getting Started

[Full content of the getting started page, rendered as markdown...]

## API Reference

[Full content of the API reference, rendered as markdown...]
```

This file can be large. No strict size limit, but consider that tools consuming it in full will use significant tokens.

## Auto-Generation Strategies

**Static site generators** (Docusaurus, Nextra, Mintlify): Build a script that runs after the build step, walks the output directory, extracts page titles and descriptions from frontmatter, and generates llms.txt with links + llms-full.txt with concatenated content.

**Dynamic sites** (Next.js App Router): Create API routes that generate content on-demand:

```ts
// app/llms.txt/route.ts
import { getAllPages } from '@/lib/docs';

export async function GET() {
  const pages = await getAllPages();

  const sections = {
    Docs: pages.filter(p => p.category === 'docs'),
    Guides: pages.filter(p => p.category === 'guides'),
    Optional: pages.filter(p => p.category === 'optional'),
  };

  let content = `# Example Site\n\n`;
  content += `> Developer platform for building real-time applications.\n\n`;

  for (const [section, items] of Object.entries(sections)) {
    content += `## ${section}\n`;
    for (const page of items) {
      content += `- [${page.title}](${page.url}): ${page.description}\n`;
    }
    content += '\n';
  }

  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown' },
  });
}
```

```ts
// app/llms-full.txt/route.ts
import { getAllPages, getPageContent } from '@/lib/docs';

export async function GET() {
  const pages = await getAllPages();
  let content = `# Example Site — Full Documentation\n\n`;

  for (const page of pages) {
    const markdown = await getPageContent(page.slug);
    content += `## ${page.title}\n\n${markdown}\n\n`;
  }

  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown' },
  });
}
```

## HTTP Headers

Add Link headers and X-Llms-Txt to every response via middleware:

```ts
// middleware.ts (Next.js)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set(
    'Link',
    '</llms.txt>; rel="llms-txt", </llms-full.txt>; rel="llms-full-txt"'
  );
  response.headers.set('X-Llms-Txt', '/llms.txt');

  return response;
}
```

## HTML Directive

Add to your root layout:

```html
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM site index" />
```

## Size Guidelines

- llms.txt: keep under 50K chars (index only, link to detailed content)
- llms-full.txt: no strict limit, but be aware of token cost
- Individual linked pages: under 50K chars each
