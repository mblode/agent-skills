# Measurement and Monitoring

Bind each metric to the actual property, hostname and project path. Verify native report access, analytics filters and conversion-event meaning before interpreting a trend.

## Separate the measurements

| Question | Evidence | Limit |
|---|---|---|
| Are pages indexed and receiving search traffic? | Native Google/Bing indexing and performance reports | Ownership verification or sitemap submission alone proves neither |
| Is the site visible in Google's generative AI features? | Search Console generative AI performance, including available impression/page/country/device/date dimensions | UI and CSV only, so an API connector reporting "no AI data" has not checked it; verify current report access and supported dimensions; do not invent AI-specific clicks or CTR from impression-only data. Read it as presence, not position: an AI answer is not a ranked list, so average position and CTR there do not mean what they mean for links |
| Is Bing/Copilot citing it? | Bing Webmaster AI Performance, available citations, cited pages and grounding-query/topic dimensions | Needs Bing Webmaster verification first, otherwise `No data`; availability and sampling vary; citation counts are not ranking positions or referral visits |
| Is a tracked prompt producing mentions/citations? | Repeated, documented engine-specific prompt panel or connected visibility tool | Preserve prompts, engine/model, search mode, locale, date, repetitions, sample size and citation URL; a panel is not population-wide demand. Report a rate per engine, never one blended score or a ranking position |
| How often do people ask the topic? | Vendor Exact prompt demand metric | Demand is not the site's share of visibility |
| Is AI influence arriving without a referral? | Branded search impressions, direct sessions in the campaign window, and a self-reported "how did you hear" answer | Leading indicators, not proof of AI attribution; keep each as its own series |
| Does discovery produce useful outcomes? | Analytics landing sessions, qualified visits, signups, activation or revenue | Preserve attribution definitions and windows; missing/referrer-stripped visits prevent complete AI attribution |
| Do the agent-readable surfaces answer? | Scanner scorecards and `agent-ready`'s `scripts/check-surfaces.sh` output, or the equivalent curl probes | Says whether `llms.txt`, markdown twins and headers work, not whether any engine cites them; agent readership itself needs server logs, and without a log drain it is `No data` |

Inspect current native capabilities using `sources.md`, not a frozen vendor checklist. Google generative AI reports may expose different dimensions for Search and Discover. Where a connector omits a native report, use an available browser/export or report that gap rather than silently substituting overall search data.

## Where the data comes from

Paid visibility tools (Profound, Peec, Semrush, Ahrefs Brand Radar, Otterly) mostly buy or scrape the same inputs an owner can reach directly. Checked 2026-10-27; reopen `sources.md` before relying on a limit.

| Input | Owner access | Limit |
|---|---|---|
| Google AI Overviews and AI Mode impressions | Search Console generative AI report, UI and CSV export only | Impressions by page, country, device and date; no clicks, CTR or queries, and no API or BigQuery field. AI Overview and AI Mode clicks are blended into ordinary Web totals and cannot be separated |
| Copilot and Bing AI citations | Bing Webmaster Tools AI Performance, UI and CSV | Sampled citations, cited pages and grounding queries (the searches the engine ran, the closest free proxy for prompt demand); no clicks, no API, does not cover ChatGPT |
| AI referral sessions | GA4 "AI Assistant" channel (from May 2026, not backfilled, excludes AI Overviews and AI Mode, which stay Organic); PostHog's AI channel type; `utm_source=chatgpt.com` | A floor: apps that strip the referrer land in Direct |
| Crawler and agent fetches | Cloudflare AI Crawl Control (dashboard, CSV, GraphQL), Vercel or other log drains, raw CDN logs | User agents can be spoofed; verify against the vendors' published IP lists (OpenAI, Anthropic, Perplexity and Google publish JSON ranges). `Google-Extended` is a robots token, never a log entry |
| Answers and citations from consumer apps | A visibility tool, or a signed-out browser run you control | What users see. Vendors scrape the apps precisely because APIs differ |
| Answers from APIs | OpenAI Responses `web_search`, Anthropic web search, Perplexity Sonar, Gemini grounding (roughly $5 to $14 per 1,000 searches) | A different system from the app: one 2026 study found the OpenAI API recovered about a quarter of the URLs ChatGPT cited. Label it "OpenAI API", never "ChatGPT". Set the locale explicitly (OpenAI `user_location`, or the provider's equivalent) and record it. Cited links from the OpenAI API carry `utm_source=openai`, which separates API-driven visits from `utm_source=chatgpt.com` app visits. Call each provider directly: a model gateway (Vercel AI Gateway was observed doing this with Perplexity) can drop the citation URLs and leave a mention-only series |
| Google AI Overviews and AI Mode result pages | SERP APIs such as DataForSEO or SerpApi (about $1 to $4 per 1,000 pages) | Third-party scraping; Google served altered pages to scrapers from mid-September 2026, so check the provider's status before trending |
| Prompt volume | None for an individual; vendors license consumer clickstream panels and model the rest | Treat vendor volumes as rough relative demand at topic level, never per-prompt counts. Proxies: Bing grounding queries, Search Console queries |

## Prompt panels

A single prompt run is a sample of one: answers and cited sources change between identical runs and from week to week. Treat each prompt as a survey question.

- For an API panel, use `scripts/prompt-panel.py` (`--help`): it calls each provider directly, enforces five runs, records method and locale, and scores named versus cited, owned versus owned off-domain. Keep the prompts file and dated results in the site's repo, not the raw answers.
- Track only prompts whose answer would change revenue or a decision, not glossary questions. Under a fixed call budget, cut prompts before cutting runs below five.
- Run each prompt at least five times in clean sessions (more when the rate is near a decision threshold) and report mention and citation rates with the run count, not a point estimate.
- Record separately whether the brand was cited as a source and whether it was named in the recommended shortlist. A page can be cited while a competitor is recommended.
- Keep each engine, and Google AI Overviews versus AI Mode, on its own line; engines retrieve from different indexes and cite different source types.
- Use real buyer questions with the persona and use case, plus at least one follow-up turn where alternatives or price are asked.
- Store the raw answer with cited URLs, engine, model, mode, locale, timestamp and collection method. Never mix collection methods (API, SERP provider, browser) in one trend line, and never infer a citation without a URL.
- Classify cited sources by type (see `answer-engines.md`); the owner's profiles on other hosts (a GitHub repository, an app store listing, a docs host) are owned off-domain, not third-party and record the attributes the answer associates with the brand; those are what content can change.
- Record recall without retrieval separately from citations. They measure different things and are never summed. A recall prompt names the brand, so score it by whether the answer is correct about the brand, not by whether the name appears.

Third-party rank and AI-visibility tools that scrape results can lose collection without notice. Check the vendor's collection status before trending its data, and prefer native reports.

## Diagnose a change

Use complete, comparable windows with matching filters. When the user asks for "the past N months", include the partial current month only labelled with its end date, and never compare it with complete months as a trend. Match data freshness and aggregation. Check reporting lag, weekdays/seasonality, campaigns, releases, migrations and tracking changes before attributing movement to ranking. Segment by brand/non-brand, page group, country, device and search appearance where supported and relevant. Do not average positions across incompatible populations.

A before/after window around a bundle of changes credits the whole bundle. Attribute by page instead: compare the pages that gained AI-feature impressions or citations with what shipped on each, and do not credit `llms.txt`, Markdown twins or schema for a gain that landed on newly published or rewritten pages.

On a young or growing site every search number rises together, so a rise in AI Overview impressions alone says little. Divide AI-feature impressions by ordinary search impressions for the same window and report that share beside the raw count; it shows whether AI answers grow faster than search overall.

Report absolute counts alongside percentage changes. Moving from 5 clicks to 4 is a one-click change, not sufficient evidence of a material incident by itself. Set alert thresholds from baseline volume, normal variance, persistence and business impact; no universal 20% threshold. For sparse data, extend the observation window or report uncertainty rather than inventing significance.

Distinguish loss of visibility, lower click-through, fewer sessions and weaker activation. Verify conversion instrumentation before concluding that SEO traffic quality changed. If authentic scope or outcome data is absent, mark it `No data` and name the smallest next check.

## Decay and refresh queue

Refreshing a page that already ranks usually moves faster than publishing a new one, so review a page-level decay list on the same comparable windows before choosing new work. For each page, compare clicks, impressions, average position and CTR across two complete windows of equal length, and list the pages that lost clicks with the absolute counts beside the change.

Set the entry bar from the property's own volume: a minimum impression count for the current window, and triggers the project has written down (a traffic fall, a position loss, a CTR fall at a steady position, or a material product or source change). Where the project has no written triggers, derive them from normal variance and say so. Before opening a refresh, rule out a redirect or slug change inside either window, a launch, seasonality and brand-query movement. Refresh the stale answer, source, screenshot or step; do not restamp the date for a cosmetic edit.

## Recurring checks

Use an existing matching owner/schedule when recurring work is authorized. A proposed cadence is not a configured monitor. Preserve the configured destination and notification preferences; do not send an unapproved recap elsewhere.

- Anomaly checks report new, material changes supported by the baseline, plus actionable access or delivery failures.
- Digests summarize completed comparable periods, leading page/query movements, engine-specific AI visibility, conversion outcomes and the next decision.
- Deduplicate previously reported incidents. An unchanged refresh does not need another notification.
- Repeated authentication failures should be surfaced through the host's supported reauthentication flow rather than retried indefinitely.

Keep monitoring reads separate from mutations. Store durable reports and alert state in the mapped project system, not inside the installed skill folder.
