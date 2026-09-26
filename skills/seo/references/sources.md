# Sources and Freshness

This registry was checked on 2026-09-08; the research table was added on 2026-09-23. Treat the date as provenance, not a promise that vendor behavior remains unchanged. Reopen the relevant official page when deciding a volatile feature, API, policy or reporting capability. Record the source and access date beside consequential claims.

## Primary guidance

| Topic | Source |
|---|---|
| Google AI search foundations, formatting myths and measurement | https://developers.google.com/search/docs/fundamentals/ai-optimization-guide |
| Google generative AI report availability and dimensions | https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports |
| Bing AI reporting | https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview |
| OpenAI search versus training and crawler identity | https://developers.openai.com/api/docs/bots |
| Anthropic crawlers | https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler |
| Google robots and preview directives | https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag |
| Sitemaps and meaningful lastmod | https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap |
| Canonical consolidation | https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls |
| Localized versions and optional x-default | https://developers.google.com/search/docs/specialty/international/localized-versions |
| Structured-data eligibility | https://developers.google.com/search/docs/appearance/structured-data/sd-policies |
| Scaled content abuse and other spam policies | https://developers.google.com/search/docs/essentials/spam-policies |
| Core Web Vitals | https://web.dev/articles/vitals |
| Next.js implementation | Installed `next/dist/docs` first; https://nextjs.org/docs/app as fallback |

## Research, not ranking contracts

https://ahrefs.com/blog/ai-brand-visibility-correlations/ reports associations from a selected established-brand population, not causal effects or universal coefficients. Use the study's current methodology, engine and sample restrictions rather than copying an undated strongest-predictor claim into instructions.

Distinguish official engine guidance, vendor observational research, a site-specific experiment and house preferences. Official Google guidance describes Google, not every answer engine. An industry study can motivate a test; it cannot establish that a specific action will improve this site's visibility.

## Dated research

These figures reached this registry through Man of Many's 2026 Guide to GEO (21 September 2026), a publisher's compilation that prints the publisher, sample and date for each and has a stated commercial interest in third-party editorial. Primaries were not reopened. Open the primary before quoting a figure, and use them to frame a test or a budget conversation, never as a promised effect for one site.

| Finding | Source, sample, date | Limit |
|---|---|---|
| 85% of brand mentions in AI answers came from third-party pages, 13.2% from the brand's domain; nearly 90% of third-party mentions were in listicles, comparisons and reviews | AirOps, 21,311 mentions, October 2025 | Mention share, not citation or traffic |
| Adding schema to 1,885 pages was followed by a 4.6% fall in AI Overview citations | Ahrefs, 11 May 2026 | One engine; schema still serves rich results and entity identity |
| No relationship between `llms.txt` and AI citations | SE Ranking, about 300,000 domains, 7 November 2025 | Says nothing about coding agents that do read it |
| 54% of sites that scaled AI-generated content lost 30% or more of peak traffic | Lily Ray, Amsive, 220+ sites, 13 May 2026 | Selected sites |
| Nearly 65% of AI citations pointed to content from the previous year; news articles persisted in citations 1.4% of the time | Seer Interactive, June 2025; SISTRIX AI Citation Drift, 2026 | Freshness means real updates, not restamped dates |
| Removing the AI Overview produced 68% more organic clicks per search; 7.1% of clicks on an AIO page came from its citations | Agarwal and Sen, randomised, 1,065 US desktop users, 2026 (SSRN 6513059) | Desktop, US, reported via Digital Content Next |
| The same prompt returned the same brand list less than once in 100 runs; weekly cited-source turnover of 56% (AI Mode) and 74% (ChatGPT) | SparkToro with Gumshoe, 2026; SISTRIX, 82,619 prompts, 2026 | Why prompt panels need repetitions. Do not cite AirOps' "2.2%" for this: it is the share of cited URLs shared by all three engines for one prompt, not run-to-run stability |
| The same prompt rarely returned the same brand list twice | SparkToro, 2,961 queries from 600 volunteers, 28 January 2026 | Why a single visibility score misleads |
| Brand search volume was the strongest tested predictor of AI brand mentions, at a correlation of about 0.33 | Kevin Indig, Growth Memo, 75,000 brands, 4 May 2026 | Strongest, not strong; correlational |
| Retrieval snippet test for whether an assistant can retrieve a page | Myriam Jessier and Chris Green, September 2026 | Proves retrievability, not trust or citation |
| Scraper-based rank and AI-visibility tools lost collection from mid-September 2026 | Search Engine Roundtable, 18 September 2026 | Unconfirmed by Google; may ease |
