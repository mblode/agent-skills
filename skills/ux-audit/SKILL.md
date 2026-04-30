---
name: ux-audit
description: Audits UI against the 30 Laws of UX with mechanical pass/warn/fail checks. Every law is either programmatic (20 rules — count nav items, parse hit-target px, regex input patterns) or rubric-based (10 rules — 1-5 anchored scoring). Emits a verdict (PASS / CONDITIONAL PASS / FAIL), a letter grade (A-F), and structured JSON findings with file:line, observed vs expected, reproduce steps, suspected location, severity, effort, and a concrete fix. Use when reviewing a flow for cognitive friction, sizing tap targets, ordering navigation items, auditing a checkout for choice overload, scoring onboarding for goal-gradient, scoring an error state for Postel's Law, or asking "is this UX sound?" Triggers on phrases like "audit this UI", "Laws of UX", "Hick's Law", "Fitts's Law", "is this accessible enough", "review for cognitive overhead", "score this design", or "audit my checkout."
---

# UX Audit

30 Laws of UX as mechanical audit checks. Every rule produces a discrete pass / warn / fail outcome — programmatic rules return numbers (count, px, ms); observational rules return a 1-5 score with a quoted rubric anchor. No vibes-based findings.

## Distinction from `ui-audit`

- `ui-audit` covers accessibility, typography, microcopy, and visible polish — *what the UI looks and reads like*.
- `ux-audit` covers cognitive, perceptual, decision, memory, and interaction principles — *how the UI behaves in the user's head*.

Run them sequentially, not in place of each other.

## Audit Workflow

Copy and track this checklist:

```text
UX Audit progress:
- [ ] Step 1: Gather inputs (file paths or globs; optional surface name)
- [ ] Step 2: Detect in-scope surfaces (nav, form, modal, list, error, dashboard, hero, pricing, empty, search-results, loading)
- [ ] Step 3: For each surface, run its playbook from references/surface-playbooks.md
- [ ] Step 4: For each rule in the playbook, load rules/<rule>.md and run its Check or Rubric procedure
- [ ] Step 5: Emit findings to the JSON schema in references/output-schema.md, then render to markdown
```

1. Audit only changed files unless a full sweep is requested.
2. Detect surfaces from element semantics (`<nav>`, `<form>`, `role="dialog"`, `<ul>` of `<li>`, `[role="alert"]`, `<header>` with marketing markup) — not from filenames.
3. Run the surface playbook in order. Each playbook lists rules; do not skip rules even if you expect them to pass.
4. For each rule, the procedure in its `## Check` or `## Rubric` section is the source of truth. Don't paraphrase — execute it.
5. If you cannot find evidence (e.g. you have JSX but no runtime latency data), emit `result: "unknown"` with a reason. Do not fabricate measurements.

## Rule Categories

| Priority | Category | Impact | Prefix | Rules | Tier 1 (programmatic) | Tier 3 (rubric) |
|----------|----------|--------|--------|-------|------------------------|------------------|
| 1 | Cognitive load | CRITICAL | `cognitive-` | 5 | 3 | 2 |
| 2 | Decision-making | HIGH | `decision-` | 8 | 5 | 3 |
| 3 | Perception | HIGH | `perception-` | 7 | 5 | 2 |
| 4 | Memory & expectation | MEDIUM-HIGH | `memory-` | 6 | 5 | 1 |
| 5 | Interaction | MEDIUM-HIGH | `interaction-` | 4 | 2 | 2 |

Total: 30 rules — 20 programmatic, 10 rubric-based.

## Surface Playbooks

For each common surface, run the rules below in this order. Full playbooks (with per-rule loading order and skip conditions) live in `references/surface-playbooks.md`.

| Surface | Playbook (rules in order) |
|---|---|
| Primary navigation | `decision-hicks-law` → `cognitive-millers-law` → `memory-jakobs-law` → `memory-serial-position` → `interaction-fittss-law` → `perception-von-restorff` |
| Form (multi-field) | `cognitive-chunking` → `decision-teslers-law` → `decision-postels-law` → `cognitive-cognitive-load` |
| Modal / dialog | `decision-hicks-law` → `interaction-fittss-law` → `memory-zeigarnik` → `interaction-flow` |
| List or feed | `memory-serial-position` → `cognitive-chunking` → `perception-similarity` → `perception-common-region` |
| Error / validation state | `decision-postels-law` → `memory-peak-end-rule` → `interaction-doherty-threshold` |
| Search results | `decision-hicks-law` → `perception-von-restorff` → `memory-serial-position` |
| Dashboard | `cognitive-cognitive-load` → `perception-proximity` → `perception-similarity` → `cognitive-millers-law` |
| Marketing hero | `interaction-aesthetic-usability` → `perception-von-restorff` → `cognitive-cognitive-load` |
| Pricing / plan selection | `decision-hicks-law` → `decision-choice-overload` → `perception-von-restorff` |
| Empty state | `memory-zeigarnik` → `memory-goal-gradient` → `interaction-aesthetic-usability` |
| Loading / async | `interaction-doherty-threshold` → `memory-zeigarnik` |

## Programmatic vs Rubric Tiers

**Programmatic (Tier 1, 20 rules):** the `## Check` section gives a procedure (with grep/Read commands) that produces a number or boolean. Compare against `## Threshold` to get pass/warn/fail. Findings include `observed` and `expected` numeric fields.

**Rubric (Tier 3, 10 rules):** the `## Rubric` section gives a 1-5 scale with one concrete anchor description per score. Score the surface against the closest anchor. Findings include `score` and the verbatim anchor text used. Pass at ≥4, warn at 3, fail at ≤2. Cross-reference `references/observational-rubrics.md` for examples.

If two rules apply to the same finding (e.g. Hick's Law + Miller's Law on a 14-item nav), emit both findings — the cross-law interactions in `rules/_sections.md` show which pairings are common.

## Hard Gates

Some failures are decisive enough to downgrade the entire audit verdict regardless of overall score. Apply these gates after computing per-rule findings:

| Gate | Condition | Verdict effect |
|---|---|---|
| Critical-category fails | ≥1 fail in `cognitive-*` rules | Downgrade to **CONDITIONAL PASS** at minimum |
| Critical-category fails (severe) | ≥2 fails in `cognitive-*` rules | Downgrade to **FAIL** |
| Foundational interaction fails | ≥1 fail in `interaction-fittss-law` OR `interaction-doherty-threshold` | Downgrade to **CONDITIONAL PASS** |
| Convention break | `memory-jakobs-law` fails AND surface is a primary commerce/auth flow | Downgrade to **CONDITIONAL PASS** |
| Dark-pattern rubric | `cognitive-cognitive-bias` scores ≤2 | Downgrade to **FAIL** (ethical floor) |
| Insufficient evidence | >50% of run rules return `unknown` | **INCOMPLETE** verdict — re-audit needed |

Verdict tiers:
- **PASS** — score ≥85, no hard gates triggered.
- **CONDITIONAL PASS** — score ≥70, ≤1 hard gate triggered.
- **FAIL** — score <70, OR ≥2 hard gates triggered, OR severe-tier hard gate.
- **INCOMPLETE** — too many `unknown` results to render a verdict.

## Output Contract

Findings conform to the JSON schema in `references/output-schema.md`. Always emit JSON first, then render to markdown for the user.

### Markdown rendering

Render in this order: verdict block first, then findings table, then audit-self-check.

```markdown
## UX Audit — src/Header.tsx

═══════════════════════════════════════════════════════════
VERDICT: CONDITIONAL PASS
Grade:   B (78 / 100)

Hard Gates:
  Critical-category fails:        1   (cognitive-cognitive-load)
  Foundational interaction fails: 1   (interaction-fittss-law)
  Convention break:               0
  Dark-pattern rubric:            n/a
  Insufficient evidence:          0   (0 unknown of 9 rules run)

Findings:  3 fail · 1 warn · 5 pass · 0 unknown
Surfaces:  primary-nav, marketing-hero
Rules run: 9 of 9 from playbook
═══════════════════════════════════════════════════════════

### Findings

| Rule | Tier | Severity | Result | Observed | Expected | Effort | Fix |
|---|---|---|---|---|---|---|---|
| `decision-hicks-law` | programmatic | HIGH | fail | count=14 | ≤7 | hours | Group into 4 categories; move tertiary into mega-menu |
| `interaction-fittss-law` | programmatic | HIGH | fail | size=24px @ Header.tsx:42 | ≥44px | hours | Increase hit target to h-11 w-11; keep glyph at 16 px |
| `interaction-aesthetic-usability` | rubric | MEDIUM | warn | score=3 | ≥4 | days | Add type scale, replace flat shadows with elevation tokens |

### Audit Self-Check

- Rules run:                  9 / 9 in playbook
- Evidence cited (file:line): 7 / 9 findings
- Reproduce steps provided:   9 / 9 fail/warn findings
- Unknowns:                   0
- Median check time:          ~30 s/rule (acceptable)
```

Letter grade mapping: 90+ → **A**; 80-89 → **B**; 70-79 → **C**; 60-69 → **D**; <60 → **F**.

Group by file. Cite `file:line` when available. Always state the literal fix. Mark clean files `✓ pass` with the rules that passed. Pass findings can be elided from the table but must remain in the JSON.

## Reference Files

| File | Read when |
|------|-----------|
| `rules/_sections.md` | Need the category index, impact rationale, or cross-law pairings |
| `rules/<prefix>-<slug>.md` | Running a specific check; one per rule |
| `references/surface-playbooks.md` | Step 3 — selecting which rules to run for the detected surface |
| `references/observational-rubrics.md` | Tier-3 rule fires; need the full 1-5 anchor descriptions with examples |
| `references/output-schema.md` | Step 5 — formatting findings as JSON; defines all required fields |

## Gotchas

- Don't load all 30 rules up front — load progressively per the surface playbook.
- Don't fabricate measurements. If you have static source but no runtime data (e.g. for `interaction-doherty-threshold`), use the static heuristic in the rule's Check section. If even that doesn't apply, emit `result: "unknown"` with a reason.
- Don't paraphrase the rule's procedure when running it. Execute the steps verbatim. The procedure is the contract.
- Don't skip the JSON output. Even when the user wants markdown, render from a complete JSON document — keeps findings auditable and merge-able across runs.
- Don't pile on every law per screen. The surface playbook is exhaustive for that surface; if a rule outside the playbook fires, mention it in a footnote, don't promote it to a finding.
- Don't cite a law without naming the violation. "Hick's Law applies here" is useless; "Hick's Law: 14 nav items exceeds 7-item ceiling — group into 4 categories" is actionable.
- Don't treat Tier-3 rubric scores as mathematically meaningful. A 3 is not "1.5× a 2" — it is "matches the 3-anchor more closely than the 2 or 4."
- Don't apply Gestalt laws (`perception-*`) without checking that grouping carries semantic meaning. Visual grouping that splits a logical group is worse than no grouping.
- Don't use the Aesthetic-Usability Effect as license to skip usability work. The rubric scores polish; usability is audited by other rules.
- Don't propose redesigns. Audits report issues with literal fixes. Redesigns are a separate ask.
- Don't quote lawsofux.com verbatim — every rule paraphrases the source and links it.

### Audit-the-audit meta-check

Self-flag the audit as **INCOMPLETE** if any of these are true (don't render PASS/FAIL):

- Fewer rules were actually executed than the playbook lists for the detected surfaces.
- More than 50% of run rules returned `unknown`.
- No `file:line` evidence cited on any fail/warn finding (suggests no source was actually read).
- No `reproduceSteps` provided on any fail finding (suggests the agent didn't gather concrete evidence).
- Median apparent time-per-rule is implausibly short (no Read or Grep tool calls between findings, suggesting fabricated results).
- All rules returned the same result (e.g. everything passed without showing observed values).

If any of these trigger, emit `verdict: "INCOMPLETE"` with the failed self-check listed in `audit.selfCheck.failures`. Do not render a grade.
