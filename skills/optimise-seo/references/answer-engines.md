# Answer Engines and AI Crawlers

Crawler policy, `llms.txt`, content signals, and the on-page shape that makes a page liftable by ChatGPT, Claude, Perplexity, and Google's AI features. Facts here were checked against vendor docs in September 2026; the field moves quarterly, so re-check a figure before spending on it.

## Contents

- [What Google actually needs](#what-google-actually-needs)
- [Crawler classes](#crawler-classes)
- [robots.ts by class](#robotsts-by-class)
- [Bot protection and Content Signals](#bot-protection-and-content-signals)
- [llms.txt: cheap, not a win](#llmstxt-cheap-not-a-win)
- [Markdown alternate](#markdown-alternate)
- [On-page shape](#on-page-shape)
- [Where citation leverage actually is](#where-citation-leverage-actually-is)

## What Google actually needs

Nothing extra. Google's AI features page: "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary... You don't need to create new machine readable files, AI text files, or markup." AI Overviews and AI Mode run on Googlebot and core ranking. The same preview controls that shape snippets also govern AI features: `nosnippet` and `max-snippet:0` remove a page from AI Overviews and AI Mode, and they remove its normal snippet too. Writing a separate "for AI" version of a page risks the scaled-content-abuse policy.

Source: https://developers.google.com/search/docs/appearance/ai-features

## Crawler classes

Sort agents by what they do before writing a rule. Blocking the wrong class is the most common self-inflicted wound.

| Class | Agents | robots.txt | Blocking costs |
|---|---|---|---|
| Search and citation | `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Bingbot`, `Googlebot` | honoured | appearance in ChatGPT search, Claude search, Perplexity answers, Bing, Google |
| User-triggered fetch | `ChatGPT-User`, `Claude-User`, `Perplexity-User` | may be ignored (OpenAI: "robots.txt rules may not apply"; Perplexity: "generally ignores robots.txt") | the live fetch when a person asks about you by name |
| Model training | `GPTBot`, `ClaudeBot`, `CCBot`, `Bytespider` | honoured | training inclusion only. OpenAI: GPTBot "is not used to determine whether content may appear in Search" |
| Control tokens, not crawlers | `Google-Extended`, `Applebot-Extended` | honoured as a token | `Google-Extended` "doesn't have a separate HTTP request user agent string"; it governs Gemini training and grounding and "does not impact a site's inclusion in Google Search nor is it used as a ranking signal". `Applebot-Extended` opts out of Apple Intelligence training without leaving Apple search |

Sources: https://developers.openai.com/api/docs/bots, https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler, https://docs.perplexity.ai/guides/bots, https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers

## robots.ts by class

One explicit rule per class. Training access is the site owner's call, so surface the trade rather than picking silently.

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

const origin = 'https://example.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
      // Search and citation: these put you in an answer. Allow unless there is a stated reason.
      { userAgent: ['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'], allow: '/' },
      // Training: a separate, deliberate decision. Denying it does not affect citations.
      { userAgent: ['GPTBot', 'ClaudeBot', 'CCBot', 'Bytespider'], disallow: '/' },
      // Usage-control tokens: no crawler is blocked; this limits what Google and Apple may do
      // with content their normal crawlers already fetched.
      { userAgent: ['Google-Extended', 'Applebot-Extended'], disallow: '/' },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  }
}
```

`userAgent` accepts an array and emits one `User-Agent` block per entry. Non-standard directives such as `Content-Signal` go through the `other` field (Next.js 16.3+), passed through verbatim.

## Bot protection and Content Signals

Check what the CDN or WAF does before touching `robots.ts`. Cloudflare blocks known AI crawlers by default on zones created since July 2025, and its managed `robots.txt` prepends a `Content-Signal` block (`search=yes, ai-train=no`, `ai-input` unset) ahead of whatever the app serves. A site can be uncitable with nothing in the codebase recording that anyone chose it.

Content Signals Policy syntax, from Cloudflare (September 2025), is a robots.txt line:

```txt
Content-Signal: search=yes, ai-input=no, ai-train=no
```

`search` is indexing, `ai-input` is grounding and RAG at answer time, `ai-train` is training. Not standardised and voluntary; pair it with WAF rules if enforcement matters. Emit it from `robots.ts` via `other: { 'Content-Signal': 'search=yes, ai-train=no' }` on the `*` rule when the platform does not already inject it.

Watching, not adopting: the IETF AIPREF drafts define a `Content-Usage` robots.txt rule and HTTP header (`Content-Usage: train-ai=n`). Vocabulary is at `draft-ietf-aipref-vocab-06` on the standards track; the attachment draft lapsed in 2026 pending a new revision. Do not build on it yet.

Sources: https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/, https://developers.cloudflare.com/ai-crawl-control/, https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/

## llms.txt: cheap, not a win

Ship it beside the sitemap if the content source makes it a ten-line route, and never book it as a result: Google says it is not required and does not use it, no major AI vendor documents parsing it, and Ahrefs (137,210 domains, May 2026) found 97% of published `llms.txt` files received zero requests, with most of the remaining 3% coming from SEO tools studying each other. `llms-full.txt` is the same trade with the bodies inlined.

```ts
// app/llms.txt/route.ts: derived from the same content source as the sitemap, so it cannot go stale.
import { getDocs, getPosts } from '@/lib/content'

export async function GET() {
  const [docs, posts] = await Promise.all([getDocs(), getPosts()])
  const body = [
    '# Brand',
    '',
    '> One sentence on what the product does and who it is for.',
    '',
    '## Docs',
    ...docs.map(d => `- [${d.title}](https://example.com/docs/${d.slug}): ${d.summary}`),
    '',
    '## Writing',
    ...posts.map(p => `- [${p.title}](https://example.com/blog/${p.slug}): ${p.summary}`),
  ].join('\n')

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
```

Sources: https://ahrefs.com/blog/llmstxt-study/, https://developers.google.com/search/docs/appearance/ai-features

## Markdown alternate

Optional. Two shapes, pick one:

**Advertise a parallel `.md`** with no negotiation. Add `alternates.types` in metadata so the HTML carries `<link rel="alternate" type="text/markdown" href="...">`, and serve `/blog/[slug].md` from a route handler that renders the same source.

```ts
alternates: {
  canonical: `https://example.com/blog/${slug}`,
  types: { 'text/markdown': `https://example.com/blog/${slug}.md` },
}
```

**Negotiate on `Accept`** at the same URL. Rewrite in `proxy.ts` and set `Vary: Accept` on both branches; a response cached without it has no `Accept` cache key and is served to the other audience.

```ts
// proxy.ts
import { NextResponse, type NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const wantsMarkdown = req.headers.get('accept')?.includes('text/markdown')
  let res: NextResponse
  if (wantsMarkdown) {
    const url = req.nextUrl.clone()
    url.pathname = `/md${url.pathname}` // a parallel route that renders Markdown
    res = NextResponse.rewrite(url)
  } else {
    res = NextResponse.next()
  }
  res.headers.set('Vary', 'Accept') // both branches, not just Markdown
  return res
}

export const config = { matcher: ['/((?!api|_next|.*\\.).*)'] }
```

## On-page shape

- Core content is in the initial HTML response. Most agents never execute JavaScript, so a client-rendered page is an empty page to them. Server Components already do this; a `"use client"` component fetching in `useEffect` is a regression you introduce.
- The first paragraph answers the question the page exists to answer, ahead of any preamble.
- Shape h2s as the questions people ask, evaluator questions first: what it is, when to use it, how it compares, how to do it, what good looks like, real limits.
- Specifics are the extractable unit: numbers, dates, named comparisons. Prose-only pages are cited far less often in every 2026 vendor study.
- `FAQPage` markup no longer earns a Google rich result (dropped 7 May 2026; Rich Results Test and Search Console API support removed over the following months). The type is still valid schema.org and still parsed. Keep it only where the questions render as visible text, because the rich-result upside that used to justify the risk is gone.

Source: https://developers.google.com/search/docs/appearance/structured-data/faqpage

## Where citation leverage actually is

The 2026 citation studies are vendor research of varying rigour, but they agree on the shape, and most of it is not markup:

- Brand search volume is the strongest published predictor of being cited, ahead of backlinks. That is a demand problem, and `seo-program` owns it.
- ChatGPT and Perplexity overlap on roughly a tenth of cited domains. "AI visibility" is not one target; name the engine and check it directly.
- Earned third-party placements out-cite owned pages by a wide margin. No markup on your own domain substitutes for them.

This skill ships the access, discovery, and parseability layer. When the ask is "why are we not cited", the answer usually lives in the bullets above, and the honest report says so.
