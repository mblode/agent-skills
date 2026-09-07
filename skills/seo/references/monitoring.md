# Measurement and Monitoring

Bind each metric to the actual property, hostname and project path. Verify native report access, analytics filters and conversion-event meaning before interpreting a trend.

## Separate the measurements

| Question | Evidence | Limit |
|---|---|---|
| Are pages indexed and receiving search traffic? | Native Google/Bing indexing and performance reports | Ownership verification or sitemap submission alone proves neither |
| Is the site visible in Google's generative AI features? | Search Console generative AI performance, including available impression/page/country/device/date dimensions | Verify current report access and supported dimensions; do not invent AI-specific clicks or CTR from impression-only data |
| Is Bing/Copilot citing it? | Bing Webmaster AI Performance, available citations, cited pages and grounding-query/topic dimensions | Availability and sampling vary; citation counts are not ranking positions or referral visits |
| Is a tracked prompt producing mentions/citations? | Repeated, documented engine-specific prompt panel or connected visibility tool | Preserve prompts, engine/model, search mode, locale, date, repetitions, sample size and citation URL; a panel is not population-wide demand |
| How often do people ask the topic? | Vendor Exact prompt demand metric | Demand is not the site's share of visibility |
| Does discovery produce useful outcomes? | Analytics landing sessions, qualified visits, signups, activation or revenue | Preserve attribution definitions and windows; missing/referrer-stripped visits prevent complete AI attribution |

Inspect current native capabilities using `sources.md`, not a frozen vendor checklist. Google generative AI reports may expose different dimensions for Search and Discover. Where a connector omits a native report, use an available browser/export or report that gap rather than silently substituting overall search data.

## Diagnose a change

Use complete, comparable windows with matching filters, data freshness and aggregation. Check reporting lag, weekdays/seasonality, campaigns, releases, migrations and tracking changes before attributing movement to ranking. Segment by brand/non-brand, page group, country, device and search appearance where supported and relevant. Do not average positions across incompatible populations.

Report absolute counts alongside percentage changes. Moving from 5 clicks to 4 is a one-click change, not sufficient evidence of a material incident by itself. Set alert thresholds from baseline volume, normal variance, persistence and business impact; no universal 20% threshold. For sparse data, extend the observation window or report uncertainty rather than inventing significance.

Distinguish loss of visibility, lower click-through, fewer sessions and weaker activation. Verify conversion instrumentation before concluding that SEO traffic quality changed. If authentic scope or outcome data is absent, mark it `No data` and name the smallest next check.

## Recurring checks

Use an existing matching owner/schedule when recurring work is authorized. A proposed cadence is not a configured monitor. Preserve the configured destination and notification preferences; do not send an unapproved recap elsewhere.

- Anomaly checks report new, material changes supported by the baseline, plus actionable access or delivery failures.
- Digests summarize completed comparable periods, leading page/query movements, engine-specific AI visibility, conversion outcomes and the next decision.
- Deduplicate previously reported incidents. An unchanged refresh does not need another notification.
- Repeated authentication failures should be surfaced through the host's supported reauthentication flow rather than retried indefinitely.

Keep monitoring reads separate from mutations. Store durable reports and alert state in the mapped project system, not inside the installed skill folder.
