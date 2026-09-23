# Audit seo against the 2026 Guide to GEO

Date: 2026-09-23
Baseline: c263f55

## Decision

Audit `seo` against Man of Many's 2026 Guide to GEO (21 September 2026), a dated, sourced compilation of AI search research. The skill already matched most of it: good SEO before AI tactics, `llms.txt` and schema as non-citation surfaces, no fixed answer shapes, correlation studies as hypotheses, native Search Console and Bing reporting. Four gaps remained.

- The earned layer was one sentence. Most brand descriptions in AI answers come from third-party reviews, comparisons and round-ups, so an audit that found the owned layers healthy had nothing to say about the remaining leverage. `answer-engines.md` now splits readable (owned) from citable (earned), asks for a category diagnosis by cited source type, and names extraction, entity naming and page maintenance as the on-page tests.
- Prompt panels had no method. `monitoring.md` now requires repetitions, per-engine rates, stored raw answers with URLs, source classification, recall kept apart from citations, and a vendor collection check before trending scraped data. It adds branded search, direct traffic and self-reported attribution as leading indicators, and reads Search Console generative AI data as presence, not position.
- Retrievability had no probe. `validation-evidence.md` adds the retrieval snippet test and its limit.
- Research figures were absent by design, which left no dated evidence for pushing back on a vendor. `sources.md` adds a dated research table with sample, date and limit per row. The figures came through the guide's compilation; primaries were not reopened, and the table says so.

The guide is a publisher selling third-party editorial and argues for it. Its sourced third-party figures were used; its own first-party data and sales conclusions were not.

## Behavioral evidence

[Inputs and outputs](evidence/2026-09-23-seo-geo/) preserve one new scenario (eval 7): a site with healthy owned layers and an agency proposing blanket FAQ schema, `llms.txt`, fixed 50-word intros and a single-run blended score. Three arms ran in fresh `claude -p` sessions with tools, MCP and slash commands disabled, the skill text appended to the system prompt, and the default model.

- No skill: rejected the fixed length and blended score, but recommended new owned pages as the main lever and named no first-party AI report.
- Old skill: rejected all four line items and named Search Console and Bing AI reporting, but put the remaining budget into owned "content and evidence" with no mention of third-party coverage.
- New skill: passed all four assertions. It named third-party reviews, comparisons and round-ups as the ceiling-lifting lever, asked for a category diagnosis by cited source type, and specified three to five runs per engine plus branded search as a leading indicator. It misattributed one figure, citing the `llms.txt` study against schema.

One run per arm on one model. This supports the targeted change, not a general quality claim. The six earlier scenarios were not re-run.

## Mechanical checks

- `validate.sh skills/seo` and `validate.sh --all`: 0 FAIL.
- `python3 -m unittest discover -s maintenance/tests`: 8 tests OK.
- `agent-evals` structural and case checks were not run: the container had Node 22 and the CLI requires Node 24. The structural check wraps the same validator.
