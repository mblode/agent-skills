---
name: docs-writing
description: Writes and audits technical documentation using the Diataxis framework and Stripe-style clarity. 52 rules across 9 categories covering voice, structure, clarity, code examples, formatting, navigation, scanability, content hygiene, and review. Use when writing docs, documenting APIs, writing tutorials or how-to guides, auditing an existing README or docs site, or asking "review my docs", "improve this documentation", or "write docs for this". For creating a README from scratch use readme-creator; for AGENTS.md or CLAUDE.md files use agents-md; for marketing copy use copywriting.
---

# Documentation Writing

- **IS:** writing and auditing technical documentation quality across Diataxis doc types, voice, structure, clarity, runnable code examples, formatting, navigation, and content hygiene. Applies to docs sites, API references, tutorials, how-to guides, and existing READMEs.
- **IS NOT:** creating a README from scratch (use `readme-creator`), AGENTS.md or CLAUDE.md agent instructions (use `agents-md`), or marketing and landing-page copy (use `copywriting`).

## Mode dispatch

- Reviewing existing docs? → Audit workflow.
- Writing new docs or rewriting a page? → Writing workflow.
- Asked to "improve" or "fix" docs? → Audit workflow first, then apply the fixes yourself instead of reporting them.

## Audit workflow

Copy and track this checklist:

```text
Docs audit progress:
- [ ] Step 1: Scope to changed files only, unless a full sweep was requested
- [ ] Step 2: Classify each doc (tutorial, how-to, reference, explanation) and audience
- [ ] Step 3: Run CRITICAL categories (voice-, structure-)
- [ ] Step 4: Run HIGH categories (clarity-, code-)
- [ ] Step 5: Run remaining in-scope categories (format-, nav-, scan-, hygiene-, review-)
- [ ] Step 6: Report findings per the output contract, ordered by severity
```

Doc type gates which rules apply, so classify before loading rules. Load rule files by category prefix (`rules/voice-*.md`, then `rules/structure-*.md`, ...) only for categories in scope. After applying fixes, rerun the rules that produced findings before finalizing.

## Writing workflow

Copy and track this checklist:

```text
Docs writing progress:
- [ ] Step 1: Pick one Diataxis type per file (tutorial, how-to, reference, explanation) and name the audience
- [ ] Step 2: Read the defaults bundles (voice-defaults, clarity-defaults, scan-defaults) plus structure rules for the doc type
- [ ] Step 3: Draft with bottom line up front, quick start for getting-started docs, runnable examples for every concept
- [ ] Step 4: Self-audit against CRITICAL and HIGH categories; fix findings
- [ ] Step 5: Verify by running every code example, resolving every link, and confirming parameter names against the implementation
```

Step 5 is the exit criterion: a doc ships only after its examples run and its links resolve, not when it "reads well".

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

For the full rule list per category, read `rules/_sections.md`. The `*-defaults.md` files (voice, clarity, scan, review) are multi-check bundles. Each codifies 3-5 baseline checks for its category.

## Output contract (audit mode)

```markdown
## Documentation Audit Findings

### path/to/file.md
- [CRITICAL] `voice-defaults`: Passive voice obscures who performs the action.
  - Fix: Rewrite "The configuration is loaded by the server" as "The server loads the configuration."

### path/to/clean-file.md
- ✓ pass
```

- Group findings by file; order by severity within each file.
- Use `file:line` when line numbers are available.
- Every finding names the rule, states the issue, and proposes a concrete fix. A finding without a fix is not reportable.
- Include clean files as `✓ pass` so the author knows they were checked.

## Gotchas

- Doc-type misclassification is the top false-positive source: `structure-quick-start` applies only to getting-started docs and READMEs, and `scan-three-column-api` only to API references. Flagging a missing quick start on an explanation page tells the author to break Diataxis.
- The `*-defaults.md` bundles contain 3-5 checks each, so cite the specific failing check ("`voice-defaults`: passive voice"), not just the filename, or the author can't locate the issue among the bundle.
- Don't load all 52 rule files up front; that floods context before scope is known. Load by prefix for in-scope categories only.
- Don't report MEDIUM/LOW polish above CRITICAL/HIGH findings; authors fix what they see first, and a serial-comma nit can bury a structure problem.
- Don't rewrite content you were asked to review; report and propose fixes unless the user asked for edits or said "improve/fix".
- Don't audit files that weren't changed unless a full sweep was explicitly requested; unscoped findings drown the real ones.

## Related skills

- `readme-creator`: creating a README from scratch; this skill audits and improves existing READMEs.
- `agents-md`: AGENTS.md/CLAUDE.md agent instruction files (execution-first standards, not reader-facing docs).
- `copywriting`: marketing, landing-page, and product copy.
- `blodemd`: scaffolding and deploying MDX docs sites; this skill governs the content quality inside them.
