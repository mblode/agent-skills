---
name: slop-cop
description: >-
  Runs the slop-cop taste linter, which answers copywriting and typography rules
  from this repository with TypeSafe Jev probabilities plus mechanical checks,
  and reads its scorecard, bands and calibration. Use when asked to "lint the
  copy", "check the typography in the code", "run slop-cop", or to measure how
  a rewrite changed the scorecard. For fixing the wording use copywriting; for
  a full type system review use typography-audit.
---

# slop-cop

Is: the operator's guide to `slop-cop`, an npm CLI that turns copywriting and typography rules from this repository and from taste-training into checks over Markdown, MDX, TSX and rendered pages. Mechanical where a regex or a real value decides; a calibrated probability from TypeSafe Jev where a judgement is needed.

Is not: the rules themselves (those live in `data/rules` inside the package and trace back to files here), a copy rewriter, or a replacement for `typography-audit` and `ui-design` audits.

## Commands

| Command | Use |
|---|---|
| `npx slop-cop lint <paths> --dry-run` | Count units, requests and estimated cost. No calls. Run this first. |
| `npx slop-cop lint <paths>` | Full run. Needs `TYPESAFE_API_KEY`. Writes `results/lint-*.json` and caches answers under `results/cache`. |
| `npx slop-cop lint <paths> --mechanical-only` | Regex and value checks only. No key needed. |
| `npx slop-cop lint <paths> --output sarif` | SARIF 2.1.0 for code scanning. `--output json` for scripts. |
| `npx slop-cop lint --url <url>` | Computed styles through style-capture and a local Chromium. `--capture file.json` for a saved capture. |
| `npx slop-cop extract <paths>` | Print the units that would be judged, as JSONL. |
| `npx slop-cop rules list` and `rules check` | Inspect and validate the shipped rules. |
| `npx slop-cop eval` and `tune` | Precision, recall and calibration per rule on the labelled corpus; threshold tuning writes `data/rules/tuning.json` only with `--write`. |

Requires Node 24. Jev calls cost $0.042 per million input tokens; the summary line prints the actual cost after every run.

## Reading a finding

Every finding carries two independent facts. **Severity** (critical, major, minor) says how bad it is if real and comes from the rule. **Band** says how sure Jev is: `act` (at or above the rule's act threshold, fails the run), `review` (between the review and act thresholds, printed with a `?` and never fails the run), and silent. Never downgrade a severity because the band is `review`; the uncertainty is already visible in the band.

`unknown` is a third outcome, not a pass: a rule could not decide because a value was unresolved (a Tailwind theme token, a missing class list) or a precondition was unmet. `--verbose` lists them.

## Workflow

1. Run `--dry-run` and quote the request count and cost.
2. Run the lint. Fix `act` findings in the copy or the classes, not by editing the rule.
3. Re-run only the files you touched; cached answers make the rest free.
4. Quote the scorecard delta by category in your summary.
5. A wrong finding is corpus evidence. Add the unit to the corpus with the correct label rather than lowering a threshold by hand; `tune` decides thresholds.

## Gotchas

- Projects that curl quotes at build time (remark-smartypants) are detected from `next.config.*`; the straight-quote rule then skips Markdown and still checks JSX. Force it with `"smartQuotesAtBuild"` in `slop-cop.config.json`.
- Deliberately bad copy (course stimuli, `Incorrect` examples, sample text) is corpus, not a lint target. Exclude it in `slop-cop.config.json` or suppress with `slop-cop-ignore: <rule-id>` on the line above. `ui-audit-ignore:<id>` from `ui-design` is honoured for ported rules.
- Class-list rules see only static Tailwind classes. Computed values, template expressions and theme tokens are `unknown` until you run `--url`.
- Jev cannot count or compare numbers, so every threshold lives in a named mechanical function; a rule that asks Jev "how many" is a bug.
- Never paste raw provider responses into an issue; the tool records categories and token counts only.

## Related skills

- `copywriting`: owns the wording of the fix.
- `typography-audit`: the 78-rule typography review this tool's typography pack is harvested from.
- `ui-design`: the audit whose `microcopy-*` and `slop-*` rules feed the copy pack.
- `docs-writing`: the voice and clarity rules behind the documentation checks.
