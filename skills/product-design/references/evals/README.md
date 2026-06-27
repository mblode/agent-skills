# Evals and the Review Loop

This is recommended calibration practice, not runtime skill behavior. It keeps `product-design` honest over time: the skill is only as good as the decisions encoded in it, and those decisions drift as components, names, and failure modes change. Two mechanisms keep it current: evals (does the guidance still produce the right edits?) and a review loop (what new evidence should change the guidance?).

## Why evals

Lint rules are deterministic, but agent behavior varies. Test the skill on interfaces it has not seen. An agent edits a `before` state, and a judge scores the result against the rubric (`rubric.md`).

- Build training fixtures from documented examples (decisions you already accept).
- Build holdouts from interfaces whose expected edits do not appear in the skill, to test whether the guidance generalizes rather than memorizes.
- Run fixtures with and without the skill loaded, to measure whether the skill changed the agent's behavior at all.
- Score rule correctness separately from similarity to a shipped result. Shipped code can contain a flaw the agent should improve, not reproduce.

## Fixture shape

Each fixture in `fixtures/` is a `before` and an `after` paired with the rules it exercises:

```
fixtures/
  <name>/
    before.jsx     # the starting interface, with a real product-design defect
    after.jsx      # a correct resolution
    notes.md       # the rule IDs exercised, and what the judge should check
```

Keep fixtures minimal and generic: one or two defects each, no framework or design-system specifics beyond plain JSX. Three are included as worked examples; add your own from real decisions.

## The weekly review loop

Standards change, and every change needs evidence and human review. Separate collection from judgment so neither contaminates the other.

1. Collector. Gather messages, links, files, and nearby context from your team's review evidence (design-review threads, design files, pull requests, and previews are common sources). Write raw artifacts only. Do not score candidates or propose rules.
2. Judge. Validate that the evidence is complete before grouping it. Group related items, verify each source, and separate verified facts from inferences and open questions. When evidence is incomplete, record the code or commit needed to verify it. Keep every candidate pending. Do not edit the guidance.
3. Human review packet. The loop ends with a packet: candidates (each linked to its source), rejected topics, follow-up requests, and coverage gaps. A comment from an experienced reviewer can raise a candidate's priority, but every candidate still needs evidence.

Automation ends at the packet. A human decides whether a candidate becomes agent guidance, a lint rule, an exemplar, an eval, or no change. Accepted changes go into the narrowest relevant file and pass the relevant checks before merging.

### Prompts

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

Track decisions you do not yet have a standard for, so missing guidance stays visible instead of silently absent. A gap is a candidate for the next review, not a failure.

Current gaps to seed your own list:
- Multi-step flows and wizards: progress, back, and abandon behavior.
- Bulk actions: selection model, partial success, and per-item error reporting.
- Real-time and collaborative states: presence, conflict, and merge.
- Notification and toast lifecycle: dismissal, stacking, and persistence.

## Self-checks for any change to this skill

- No em dashes anywhere (the source material uses them; strip on import).
- Every cited rule ID exists in `../rules.md` (or, for copy IDs, in `copywriting/references/ui-states.md`).
- New rules record scope, rationale, evidence, exceptions, and a bad and good example.
- Deterministic checks went to the lint package; judgment stayed in prose with its evidence.
- No single screenshot, shipped file, or reviewer comment was promoted into a universal rule by itself.
