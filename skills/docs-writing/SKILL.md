---
name: docs-writing
description: Writes and audits technical docs with Diataxis type gating, runnable examples, and 51 documentation rules. Use when asked to "review my docs", "write an API reference", or improve a documentation page. For a whole README use readme-creator; for agent instructions use agents-md.
---

# Documentation Writing

- **IS:** writing and auditing technical documentation quality (Diataxis doc types, voice, structure, clarity, runnable code, formatting, navigation, content hygiene, agent-readable docs) for docs sites, API references, documentation-site tutorials, how-to docs, and existing READMEs.
- **IS NOT:** editorial blog tutorials or articles (use the external `ghostwriter` skill with platform `blog`), a README from scratch or a whole-README rewrite (use `readme-creator`; a README that needs its prose fixed in place stays here), AGENTS.md or CLAUDE.md instructions (use `agents-md`), marketing and landing-page copy (use `copywriting`), or the product's own error strings and CLI output (use `dx-audit`; this skill covers the docs that describe them).

## Mode dispatch

- Reviewing docs? → Audit workflow.
- Writing or rewriting a page? → Writing workflow.
- "Improve" or "fix" docs? → Audit first, then apply fixes yourself.

## Classify before anything else

Doc type gates which rules apply, so classify every file first. Use the Diataxis compass: does the page serve **action** (doing) or **cognition** (understanding), and is the reader **acquiring** a skill or **applying** one?

| | Acquisition (learning) | Application (working) |
|---|---|---|
| **Action** | Tutorial | How-to guide |
| **Cognition** | Explanation | Reference |

A page that answers differently for different sections is mixed; `structure-diataxis` handles the split. Classify by the reader's task, not the filename. A README can orient or reference; a getting-started page can be a tutorial or a goal-directed how-to.

## Audit workflow

Track this checklist:

```text
Docs audit progress:
- [ ] Step 1: Scope to changed files unless a full sweep was requested
- [ ] Step 2: Classify each doc with the compass; name the audience
- [ ] Step 3: Run CRITICAL categories (voice-, structure-), skipping rules the type-gating table excludes
- [ ] Step 4: Run HIGH categories (clarity-, code-)
- [ ] Step 5: Run remaining in-scope categories (format-, nav-, scan-, hygiene-, review-)
- [ ] Step 6: Report per the output contract, by severity
```

Load rule files by category prefix (`rules/voice-*.md`, then `rules/structure-*.md`, ...) only for in-scope categories. After applying fixes, rerun the rules that produced findings before finalizing.

## Writing workflow

Track this checklist:

```text
Docs writing progress:
- [ ] Step 1: Pick one Diataxis type per file with the compass; name the audience and what they can do afterwards
- [ ] Step 2: Read the defaults bundles (voice-defaults, clarity-defaults, scan-defaults) plus the structure- and code- rules the type-gating table keeps
- [ ] Step 3: Draft: bottom line up front, quick start for getting-started docs, runnable example per concept, next steps for tutorials and how-tos
- [ ] Step 4: Apply the type-relevant rules to concrete weaknesses in the draft
- [ ] Step 5: Verify: run every example, resolve every link, confirm parameter names and defaults against the implementation; quote the command output
```

Step 5 is the exit criterion: a doc ships when its examples ran and its links resolved, not when it "reads well". Length follows what the reader has to do, not the template: drop a section the page does not need rather than filling it.

## Type-gating table

These rules apply only to the listed types. Flagging them elsewhere tells the author to break Diataxis.

| Rule | Applies to |
|------|-----------|
| `structure-quick-start` | Getting-started pages, READMEs |
| `structure-next-steps`, `structure-procedures` | Tutorials, how-to guides |
| `code-multiple-languages` | Reference and how-to pages for a multi-SDK API |
| `scan-three-column-api` | API reference |
| `hygiene-experimental-label`, `hygiene-planned-label` | Reference and how-to pages for unstable or unshipped features |
| `nav-agent-readable` | Docs sites (not a single README) |

Everything else applies to every type. Tutorials additionally get the `we` allowance in `voice-defaults`; reference pages get the signature-block allowance in `structure-heading-overview`.

## Rule categories by priority

| Priority | Category | Impact | Prefix | Rules |
|----------|----------|--------|--------|-------|
| 1 | Voice & Tone | CRITICAL | `voice-` | 4 |
| 2 | Structure & Organization | CRITICAL | `structure-` | 9 |
| 3 | Clarity & Language | HIGH | `clarity-` | 5 |
| 4 | Code Examples | HIGH | `code-` | 8 |
| 5 | Formatting & Syntax | MEDIUM-HIGH | `format-` | 7 |
| 6 | Navigation & Linking | MEDIUM-HIGH | `nav-` | 7 |
| 7 | Scanability & Readability | MEDIUM | `scan-` | 2 |
| 8 | Content Hygiene | MEDIUM | `hygiene-` | 6 |
| 9 | Review & Testing | LOW-MEDIUM | `review-` | 3 |

For the full rule list per category, read `rules/_sections.md`. The `*-defaults.md` files (voice, clarity, scan, review) are multi-check bundles, 2-5 baseline checks each.

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

- Doc-type misclassification is the top false-positive source. A missing quick start on an explanation page, or a "Next steps" section demanded of a reference page, is a finding against Diataxis, not for it. Check the type-gating table before reporting.
- Cite the specific failing check in a `*-defaults.md` bundle ("`voice-defaults`: passive voice"), not just the filename, or the author can't locate the issue.
- Load rule files by prefix for in-scope categories only. Loading the whole folder before scope is known floods context and buries the CRITICAL findings under MEDIUM ones.
- "Should" is not a bug. Google's current word list uses "should" for a recommendation and "must" for a requirement; flag "should" only where the sentence states a requirement. Flagging every "should" produces a wall of false positives.
- An example key that looks live (`sk_live_...`) gets pasted into real code and tripped by secret scanners. Sample credentials use the provider's test prefix (`sk_test_...`) or an explained placeholder (`YOUR_API_KEY`); see `code-placeholders`.
- A hand-typed "Last updated: 2024-03-01" that nobody maintains reads as "abandoned" and is worse than no date. Only recommend `hygiene-update-metadata` when the date can come from the build or VCS.
- A "This guide is part of the X series" opener on every page of a docs site duplicates the sidebar and breadcrumb the site already renders. `nav-breadcrumb-context` is for plain Markdown in a repo and for pages with a prerequisite the reader must have met.
- Don't rewrite content you were asked to review; report and propose fixes unless the user said "improve" or "fix".
- Don't audit unchanged files unless a full sweep was explicitly requested; unscoped findings drown the real ones.

## Related skills

- `readme-creator`: a README from scratch or a full rewrite; this skill audits and fixes existing ones in place.
- `agents-md`: AGENTS.md/CLAUDE.md instruction files (execution-first, not reader-facing docs).
- `copywriting`: marketing, landing-page, and product copy.
- `dx-audit`: the product's own error messages, CLI output, and API ergonomics; this skill covers how the docs describe them.
- `optimise-seo`: implementing `llms.txt`, AI-crawler policy, and Markdown routes in a Next.js App Router site; `nav-agent-readable` says what the docs should expose, that skill builds it.
- Optional external `ghostwriter` where installed: editorial tutorials, how-to articles, thought leadership, and long-form posts, drafted from the `blog` platform profile.
- Optional external `blodemd` where installed: scaffolds/deploys MDX docs sites; this skill governs content quality inside them.

Maintenance only: `evals/evals.json` contains regression scenarios for changes to this skill; it does not load during a user task.
