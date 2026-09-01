---
name: seo-program
description: Runs the demand side of an SEO and AEO program in two modes. Topic pipeline pulls live keyword and prompt volumes with real numbers, builds an answer-engine question map, and writes a writer content brief. Monitoring watches Search Console and prompt visibility and reports only state changes. Binds each job to whatever research and chat tools the team already has instead of requiring a named vendor. Use when asked to "what's the search volume", "check prompt volume", "write a content brief", "brief this article for a writer", "build a question map", "what questions should this page answer", "review Search Console", "why did our clicks drop", or "set up SEO monitoring". Writes briefs and research, never the article itself. For implementing the page in code use optimise-seo, and for the article use the external ghostwriter skill with platform blog.
---

# SEO Program

- **IS:** demand research with live numbers, answer-engine question maps, writer content briefs, and the monitoring cadence that reports whether any of it worked.
- **IS NOT:** implementing the page in code (`optimise-seo` owns metadata, schema, canonicals, `llms.txt`), writing the article (external `ghostwriter` with the blog profile), or short-form product copy (`copywriting`). This skill starts once a topic is chosen and ends when the brief is handed over.

## Mode dispatch

| The ask | Mode |
|---|---|
| Volumes, a question map, or a brief for one topic | Topic pipeline |
| Search Console review, a traffic drop, recurring checks | Monitoring |

Either mode needs the tool binding below on first run.

## Setup: bind jobs to tools

Read what is actually connected before asking anything. Then propose one tool per job and ask only about the jobs with no connected option.

| Job | Typical tools |
|---|---|
| Keyword volume | Semrush, Ahrefs, Google Ads Keyword Planner in a signed-in browser |
| Prompt and AI visibility | Profound, or the connected AI-visibility tool |
| Search performance | Google Search Console via connector or signed-in browser |
| Docs and pipeline | Notion, Google Sheets or Docs, Linear, Airtable |
| Team chat and recaps | Slack, Teams, email |
| Call recordings (demand signals) | whatever recording tool is connected |

No vendor is required. Name a tool when it is connected, fall back to the next connected option when it is not, and say plainly when a job has nothing behind it rather than working around the gap silently. Never state that a tool is connected without having seen it.

If a tool needs a login, hand the browser over and let the user sign in. Never type credentials.

## Mode A: Topic pipeline

Copy and track this checklist:

```text
Topic pipeline progress:
- [ ] Step 1: Pull live keyword and prompt volumes for the topic
- [ ] Step 2: Build the question map
- [ ] Step 3: Write the brief
- [ ] Step 4: Hand over the numbers table as evidence
```

### Step 1: Research (live numbers only)

Full per-tool procedure, match types, and the no-data path: [references/research-protocol.md](references/research-protocol.md).

- Pull the numbers today. Yesterday's export and a remembered figure are context, never the source of truth.
- The primary keyword needs a modifier. `data analyst` is a category, `ai data analyst` is a query with intent behind it.
- For prompt volume, Exact match (terms in the given order) is the number. Phrase and any-order match are unreliable on multi-word terms and never go in the number column.
- Record scope (global unless the user asked for a country) and the date window next to every figure.
- When a tool returns nothing, write "No data". A fabricated volume routes real writing effort at a topic nobody searches.
- Pull brand search volume alongside the topic terms. In Ahrefs' 75,000-brand study it correlates with AI-search visibility at 0.392 against 0.218 for backlinks, so it beats links but trails branded web mentions (0.664) and YouTube mentions (0.737). Record it because it is the one number on the brief that content alone will not move, and say which of the three you measured rather than calling any of them the predictor.
- A keyword tool's related-keyword database is often empty for niche or product-shaped seeds. Search Console's own query report is the related-query universe for a site that has any traffic at all.

### Step 2: Question map

Turn the topic into the questions people actually type. Evaluator questions first: what it is, when to use it, how it compares, how to do it, what good looks like, and the real limits. Product-specific questions after.

Google's AI features fan a single query out into concurrent related queries and synthesise across all of them, so the unit that gets retrieved is the cluster, not the keyword. Brainstorm the five to ten queries the engine is likely to fan out to and check the site covers them somewhere, rather than aiming one narrow page at one string.

Every question has to be one a person would ask out loud. Keyword-stuffed pseudo-questions ("what is the best ai data analyst tool for teams in 2026") read as machine output to both readers and answer engines. Mark questions the page already answers as covered and drop them from the map.

### Step 3: Brief

Template: [references/brief-template.md](references/brief-template.md). Copy it rather than improvising the shape.

A brief is short and decision-shaped. It carries why the page exists, the SEO decisions (title, meta, H1, canonical, primary and secondary keywords with their volumes attached), a north star for tone, a handful of ideas to land, the page shape, the questions worth answering, and public sources the writer can actually cite.

It does not carry an internal feature dump, a section-by-section outline that leaves the writer nothing to decide, private wiki URLs, or invented stats, quotes, and product behaviour.

A new brief is a new file. Revising a topic means writing the next brief, not overwriting the record of what was asked for last time.

### Step 4: Evidence

The pipeline ends with a numbers table, not an assurance that the research was done. Every figure carries its source, scope, and date window, and every gap says "No data" rather than going blank. The table format is in `references/research-protocol.md`.

## Mode B: Monitoring

What each cadence checks and what earns a message: [references/monitoring.md](references/monitoring.md).

Track answer engines separately. ChatGPT and Perplexity overlap on roughly a tenth of cited domains, so a single "AI visibility" number averages two unrelated results into one that describes neither. Name the engine beside every figure.

Report state changes, not state. Clicks or impressions moving roughly 20% or more, average position worsening meaningfully, or 5xx and 404 counts jumping are worth a message; a flat week is not. Never fabricate a metric to fill a report: if access failed, say which property and move on. Track what has already been reported so the same drop is not raised twice.

For the scheduling itself, use the harness (`/schedule` for a recurring cloud run, `/loop` for an in-session interval). This skill defines what to check, not how to fire it.

## Delivery

Findings go in chat. Write a file only when the user asked for one, and never leave research notes, CSVs, or scratch exports behind in the repo.

## Gotchas

- Don't hand a writer a brief with keyword themes and no volumes: the writer cannot judge whether the topic is worth 2000 words, so the page gets written on vibes and ranks for nothing.
- Don't put a Phrase-match or any-order figure in the prompt-volume column: it absorbs unrelated queries, so a niche topic reads as a priority.
- Don't name a brief after the company: the page title is derived from the brief title, so a company-named brief quietly becomes a brand-led page.
- Don't quote a Search Console number you did not pull. An invented coverage count sends the fix to the wrong page and is invisible to everyone reviewing the brief.
- Don't post a recap to a guessed channel. If no chat tool is mapped, bind it first rather than picking the most likely-looking Slack channel.
- Don't overwrite last month's brief with this month's: the diff between them is the record of what changed and why.
- Don't treat a stale CSV as today's research because the file is right there. Re-pull, or label the number with the date it came from.
- Don't take a vendor's Search Console connector as equivalent to Search Console. Connectors have been seen under-reporting a property by an order of magnitude or worse; reconcile against the GSC property once before trusting the connector, then say which source a number came from.
- Don't report a count two exports disagree on without saying so. Site-audit and on-page tools from the same vendor routinely return different numbers for the same check; name the one you treated as authoritative and why.
- Don't report on an export without confirming the property it covers. Adjacent domains and a bare hostname change produce files that look right and describe a different site.

## References

- [references/research-protocol.md](references/research-protocol.md): per-job pull procedure, match types, scope and date windows, the no-data path, the evidence table format; read during Mode A steps 1 and 4
- [references/brief-template.md](references/brief-template.md): the brief itself; copy during Mode A step 3
- [references/monitoring.md](references/monitoring.md): what each cadence checks and what earns a message; read in Mode B

## Related skills

- `optimise-seo`: builds the page this skill specifies (metadata, schema, canonicals, `llms.txt`, AI-crawler policy, Core Web Vitals)
- `copywriting`: short-form product and marketing copy, CTAs, UI strings
- External `ghostwriter` with the blog profile: writes the article from the brief
