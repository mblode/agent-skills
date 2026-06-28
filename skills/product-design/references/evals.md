# Evals and the Review Loop

Read when calibrating this skill: testing whether the guidance still produces the right edits, or running the review loop that prepares guideline updates for human review. This is recommended practice, not runtime skill behavior. The skill is only as good as the decisions encoded in it, and those decisions drift as components, names, and failure modes change.

## Contents

- Why evals
- Fixture shape
- Judge rubric
- The review loop
- Coverage gaps
- Self-checks for any change

## Why evals

Lint rules are deterministic, but agent behavior varies. Test the skill on interfaces it has not seen. An agent edits a `before` state, and a judge scores the result against the rubric below.

- Build training fixtures from documented examples (decisions you already accept).
- Build holdouts from interfaces whose expected edits do not appear in the skill, to test whether the guidance generalizes rather than memorizes.
- Run fixtures with and without the skill loaded, to measure whether the skill changed the agent's behavior at all.
- Score rule correctness separately from similarity to a shipped result. Shipped code can contain a flaw the agent should improve, not reproduce.

## Fixture shape

Keep each fixture minimal and generic: a `before` with one or two real product-design defects, an `after` with a correct resolution, and the rule IDs it exercises. Plain JSX, no framework or design-system specifics.

```
fixtures/<name>/
  before.jsx   # the starting interface, with a real product-design defect
  after.jsx    # a correct resolution
  notes.md     # the rule IDs exercised, and what the judge should check
```

Seed your set from real decisions. Worked starting points: a destructive confirm whose CTA reads "Confirm" (`rule/destructive-names-action`); a select with two static options (`rule/control-matches-cardinality`); a fetch that renders only the populated success case (`rule/cover-reachable-states`, `rule/empty-state-action`, `rule/error-states-recovery`).

## Judge rubric

Score the two dimensions separately; do not average them.

Dimension 1, rule correctness (primary). Did the agent make the right product decision by the rules, regardless of whether it matches the reference `after`?

| Score | Meaning |
|-------|---------|
| Pass | Every defect in `notes.md` is resolved correctly, no new defect introduced, right rule IDs cited. |
| Partial | Main defect resolved but a secondary one missed, or the fix is correct but cites the wrong or no rule ID. |
| Fail | Main defect unresolved, misdiagnosed, or a new defect introduced. |

Credit only defects actually fixed; do not credit plausible-looking changes that miss the named issue.

Dimension 2, similarity to reference (secondary, informational). High: substantially the same resolution. Medium: a different but valid resolution. Low: diverges, judge on Dimension 1 alone. A correct fix that differs from the reference is still correct; a fix that matches the reference but reproduces a flaw it contained is still wrong on Dimension 1.

Scope discipline, penalize on Dimension 1 if the agent:

- Restyled or rebuilt visuals instead of routing that to `ui-design`.
- Wrote line-level framework fix patches instead of decision-level findings (that is `ui-audit`'s job).
- Broadened a copy pass into a redesign, or an audit into edits, without being asked.
- Added configuration or new UI where a better default would have solved the job (`rule/smallest-intervention`).

## The review loop

Standards change, and every change needs evidence and human review. Separate collection from judgment so neither contaminates the other.

1. Collector. Gather messages, links, files, and nearby context from your team's review evidence (design-review threads, design files, pull requests, previews). Write raw artifacts only. Do not score candidates or propose rules.
2. Judge. Validate that the evidence is complete before grouping it. Group related items, verify each source, and separate verified facts from inferences and open questions. When evidence is incomplete, record the code or commit needed to verify it. Keep every candidate pending. Do not edit the guidance.
3. Human review packet. The loop ends with a packet: candidates (each linked to its source), rejected topics, follow-up requests, and coverage gaps. A comment from an experienced reviewer can raise a candidate's priority, but every candidate still needs evidence.

Automation ends at the packet. A human decides whether a candidate becomes agent guidance, a lint rule, an exemplar, an eval, or no change. Accepted changes go into the narrowest relevant file and pass the relevant checks before merging.

```
Collector
You are the collector. Gather messages, links, files, and nearby context.
Write raw artifacts only. Do not score candidates or propose rules.

Judge
You are the judge. Validate coverage before grouping related evidence.
Separate verified facts, inferences, and open questions. Keep every
candidate pending. Do not edit the guidance.

Human review
Choose: rule, reference, exemplar, lint rule, eval, coverage gap, or no change.
Require stable evidence, explicit scope and exceptions, and an approver.
```

## Coverage gaps

Track decisions you do not yet have a standard for, so missing guidance stays visible instead of silently absent. A gap is a candidate for the next review, not a failure. Seed your list with:

- Multi-step flows and wizards: progress, back, and abandon behavior.
- Bulk actions: selection model, partial success, and per-item error reporting.
- Real-time and collaborative states: presence, conflict, and merge.
- Notification and toast lifecycle: dismissal, stacking, and persistence.

## Self-checks for any change to this skill

- No em dashes anywhere (source material often uses them; strip on import).
- Every cited rule ID exists in `rules.md` (or, for copy IDs, in `copywriting/references/ui-states.md`).
- New rules record scope, rationale, evidence, exceptions, and a bad and good example.
- Deterministic checks became lint patterns; judgment stayed in prose with its evidence.
- No single screenshot, shipped file, or reviewer comment was promoted into a universal rule by itself.
