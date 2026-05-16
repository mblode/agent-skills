# AI Crawler Policy Guide

## Contents

- Crawler user agent reference
- Recommended robots.txt template
- Content signals
- Rate limiting
- Legal considerations

## Crawler User Agent Reference

AI companies split crawlers by purpose. Each requires a separate `User-agent` directive.

| Company | Training | Search/Retrieval | User-Initiated |
|---------|----------|------------------|----------------|
| OpenAI | GPTBot | OAI-SearchBot | ChatGPT-User |
| Anthropic | ClaudeBot | Claude-SearchBot | Claude-User |
| Google | Google-Extended | (via Googlebot) | — |
| Meta | Meta-ExternalAgent | — | — |
| Perplexity | — | PerplexityBot | Perplexity-User |
| Amazon | Amazonbot | — | — |
| Common Crawl | CCBot | — | — |
| ByteDance | Bytespider | — | — |
| Apple | Applebot-Extended | Applebot | — |

Blocking GPTBot does **not** block OAI-SearchBot. ClaudeBot does **not** block Claude-SearchBot. Each bot is independent.

## Recommended robots.txt Template

The consensus strategy is **selective openness**: allow search/retrieval crawlers for discoverability, block training crawlers and aggressive scrapers.

```
# Traditional Search Engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# AI Search/Retrieval — ALLOW (drives referral traffic)
User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Applebot
Allow: /

# AI Training — BLOCK (scrapes for model training, no direct value)
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

# Default
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /internal/

# AI Content Signals
# training: no
# search-grounding: yes
# input-use: yes

Sitemap: https://example.com/sitemap.xml
```

Adapt this template to your use case:
- **Content-as-product** businesses (media, publishers) → more restrictive
- **Product-discovery** businesses (SaaS, e-commerce, docs) → more open
- **Open-source/developer tools** → maximally open

## Content Signals

Declare usage preferences in robots.txt comments. These are policy signals checked by isitagentready.com:

```
# AI Usage Preferences
# training: no — do not use content for model training
# search-grounding: yes — content may be used for search citations and grounding
# input-use: yes — content may be used when user provides URL directly
```

Only 4% of top 200K sites include these signals. Include them for completeness and scoring.

## Rate Limiting

robots.txt is a policy signal, not enforcement. Layer with:

- **Crawl-delay directive**: `Crawl-delay: 10` (seconds between requests) — respected by some bots
- **Server-side rate limiting**: Throttle by user agent at the CDN/proxy level
- **Cloudflare Bot Management**: Automated detection and throttling
- **429 responses**: Return `429 Too Many Requests` with `Retry-After` header

## Legal Considerations

- robots.txt does not constitute a legal agreement — it is a convention
- Terms of Service should explicitly address AI/LLM training use
- Consider adding a `TDM-Reservation: 1` header (EU Text and Data Mining opt-out, Article 4 DSM Directive)
- Content Signals in robots.txt complement but do not replace legal terms
