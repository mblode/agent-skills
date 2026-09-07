# Answer Engines

AI discovery has several surfaces: search retrieval, model training, user-triggered fetching and browser agents. Identify which one the request concerns before changing access or interpreting a metric.

## Access policy

| Purpose | Examples | Decision |
|---|---|---|
| Search retrieval | OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot, Bingbot | Permit discovery where the owner wants search visibility; verify current vendor rules and published IP ranges |
| User-triggered fetching | ChatGPT-User, Claude-User, Perplexity-User | May have different robots behavior; check current vendor documentation rather than assuming search-bot semantics |
| Training | GPTBot, ClaudeBot, CCBot | Preserve the owner's training decision independently of search access |
| Usage controls | Google-Extended, Applebot-Extended | Consult current vendor scope; these are not separate HTTP crawlers |

OpenAI explicitly separates OAI-SearchBot search access from GPTBot training permission. Do not claim that allowing training earns citations or that blocking training removes ChatGPT search visibility. Avoid generalizing one vendor's controls to all engines.

Inspect the served robots file and applicable group selection. A specifically named user-agent group can supersede wildcard rules, so carry forward intended private-path exclusions. Check origin, CDN/WAF challenges and published verified-bot rules separately. Spoofing a user-agent string tests a response path; it does not establish real crawler identity or successful bot access from vendor IPs.

Google's AI search uses ordinary search foundations. Verify current Search Console inclusion settings and snippet controls against official documentation before advising an opt-out; do not hard-code a claim that one robots directive is the only control forever.

## Content and distribution

Make substantive text and links available in the served page. Summaries and question headings are useful when they help readers, not required AI markup. Answer real evaluator questions, show evidence and limitations, and keep public product facts consistent across the site and documentation.

Seek useful independent reviews, demonstrations, research and community contributions when they fit the audience. Do not prescribe fabricated mentions or a quota of backlinks or videos. Correlation studies are dated hypotheses with selection criteria, not causal recipes or promised visibility gains. Identify engine, sample and outcome before applying a study to a small project.

## Optional machine-readable surfaces

`llms.txt` and Markdown alternatives can help tools that use them. They are not Google ranking requirements or evidence of citations. Add them for a real consumer and keep them aligned with the visible source rather than duplicating a second content system.

Prefer an explicit Markdown URL when content negotiation adds unnecessary cache complexity. If negotiation is required, honor Accept quality values, including `q=0`, preserve required Vary fields on both representations, and verify actual CDN behavior in both request orders. Next may replace Vary on framework-generated HTML; do not claim cache safety from a header set only on the Markdown response. Keep canonical and indexing policy intentional for alternate URLs.

Measure native AI visibility and referral/conversion outcomes using `monitoring.md`. A successful fetch, an `llms.txt` file or an agent-friendly demo does not establish that an engine cited the site.
