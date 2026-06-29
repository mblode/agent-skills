---
name: docs-writing
description: Writes and audits technical documentation using the Diataxis framework and Stripe-style clarity. 52 rules across 9 categories covering voice, structure, clarity, code examples, formatting, navigation, scanability, content hygiene, and review. Use when writing docs, documenting APIs, writing documentation-site tutorials or how-to guides, auditing an existing README or docs site, or asking "review my docs", "improve this documentation", or "write docs for this". For editorial blog tutorials use blog-post; for creating a README from scratch use readme-creator; for AGENTS.md or CLAUDE.md files use agents-md; for marketing copy use copywriting.
---

# Documentation Writing

- **IS:** writing and auditing technical documentation quality (Diataxis doc types, voice, structure, clarity, runnable code, formatting, navigation, content hygiene) for docs sites, API references, documentation-site tutorials, how-to docs, and existing READMEs.
- **IS NOT:** editorial blog tutorials or articles (use `blog-post`), a README from scratch (use `readme-creator`), AGENTS.md or CLAUDE.md instructions (use `agents-md`), or marketing and landing-page copy (use `copywriting`).

## Mode dispatch

- Reviewing docs? → Audit workflow.
- Writing/rewriting a page? → Writing workflow.
- "Improve"/"fix" docs? → Audit first, then apply fixes yourself.

## Audit workflow

Track this checklist:

```text
Docs audit progress:
- [ ] Step 1: Scope to changed files unless a full sweep was requested
- [ ] Step 2: Classify each doc (tutorial, how-to, reference, explanation) and audience
- [ ] Step 3: Run CRITICAL categories (voice-, structure-)
- [ ] Step 4: Run HIGH categories (clarity-, code-)
- [ ] Step 5: Run remaining in-scope categories (format-, nav-, scan-, hygiene-, review-)
- [ ] Step 6: Report per the output contract, by severity
```

Doc type gates which rules apply, so classify before loading. Load rule files by category prefix (`rules/voice-*.md`, then `rules/structure-*.md`, ...) only for in-scope categories. After applying fixes, rerun the rules that produced findings before finalizing.

## Writing workflow

Track this checklist:

```text
Docs writing progress:
- [ ] Step 1: Pick one Diataxis type per file (tutorial, how-to, reference, explanation); name the audience
- [ ] Step 2: Read defaults bundles (voice-defaults, clarity-defaults, scan-defaults) plus structure rules for the type
- [ ] Step 3: Draft: bottom line up front, quick start for getting-started docs, runnable example per concept
- [ ] Step 4: Self-audit against CRITICAL and HIGH categories; fix findings
- [ ] Step 5: Verify: run every example, resolve every link, confirm parameter names against the implementation
```

Step 5 is the exit criterion: a doc ships only after its examples run and links resolve, not when it "reads well".

## Rule categories by priority

| Priority | Category | Impact | Prefix | Rules |
|----------|----------|--------|--------|-------|
| 1 | Voice & Tone | CRITICAL | `voice-` | 4 |
| 2 | Structure & Organization | CRITICAL | `structure-` | 10 |
| 3 | Clarity & Language | HIGH | `clarity-` | 6 |
| 4 | Code Examples | HIGH | `code-` | 7 |
| 5 | Formatting & Syntax | MEDIUM-HIGH | `format-` | 8 |
| 6 | Navigation & Linking | MEDIUM-HIGH | `nav-` | 6 |
| 7 | Scanability & Readability | MEDIUM | `scan-` | 2 |
| 8 | Content Hygiene | MEDIUM | `hygiene-` | 6 |
| 9 | Review & Testing | LOW-MEDIUM | `review-` | 3 |

For the full rule list per category, read `rules/_sections.md`. The `*-defaults.md` files (voice, clarity, scan, review) are multi-check bundles, 3-5 baseline checks each.

## Output contract (audit mode)

```markdown
## Documentation Audit Findings

### path/to/file.md
- [CRITICAL] `voice-defaults`: Passive voice obscures who performs the action.
  - Fix: Rewrite "The configuration is loaded by the server" as "The server loads the configuration."

### path/to/clean-file.md
- ✓ pass
```

- Group by file; order by severity within each file.
- Use `file:line` when available.
- Every finding names the rule, states the issue, proposes a fix. No fix, not reportable.
- List clean files as `✓ pass` so the author knows they were checked.

## Gotchas

- Doc-type misclassification is the top false-positive source: `structure-quick-start` applies only to getting-started docs and READMEs, `scan-three-column-api` only to API references. Flagging a missing quick start on an explanation page tells the author to break Diataxis.
- Cite the specific failing check in a `*-defaults.md` bundle ("`voice-defaults`: passive voice"), not just the filename, or the author can't locate the issue.
- Don't load all 52 rule files up front; load by prefix for in-scope categories only, to avoid flooding context before scope is known.
- Don't rank MEDIUM/LOW polish above CRITICAL/HIGH; authors fix what they see first, so a serial-comma nit can bury a structure problem.
- Don't rewrite content you were asked to review; report and propose fixes unless the user said "improve/fix".
- Don't audit unchanged files unless a full sweep was explicitly requested; unscoped findings drown the real ones.

## Related skills

- `readme-creator`: a README from scratch; this skill audits and improves existing ones.
- `agents-md`: AGENTS.md/CLAUDE.md instruction files (execution-first, not reader-facing docs).
- `copywriting`: marketing, landing-page, and product copy.
- `blog-post`: editorial tutorials, how-to articles, thought leadership, long-form posts.
- Optional external `blodemd` where installed: scaffolds/deploys MDX docs sites; this skill governs content quality inside them.
