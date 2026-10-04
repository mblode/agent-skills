# Decision briefs

Read when a consequential decision goes to a human, in any mode. The human reads about 240 words a minute; the agent writes pages in seconds. A decision argued in prose makes the slower reader do the translation. Do it for them: measure the options, show them, ask about the one fact that decides it, and record the answer.

Running example: a feature needs four more props on a shared `DataTable`. Extend it, or build a new component?

## 1. Measure, don't predict

Before asking, get each option's cost from the repository: call sites affected, files and lines touched, tests that change, public API change. When a spike is cheap and reversible, build each option in a scratch branch or worktree, run the tests, and report what broke. A measured line beats a paragraph of reasoning:

> Extend: 4 new props, 23 call sites untouched, 1 test file changes. New `ReportTable`: 1 new file, duplicates sort and paging (about 60 lines).

"Option A covers all 60 call sites; 8 need a judgement call" is the shape to aim for.

## 2. Name the hinge

State what would flip the recommendation, as a `Flips if:` line. The hinge is usually context the repository cannot hold: the roadmap, how far the feature will grow, a migration the team already agreed, a deadline. When the hinge is a fact only the human has, ask about the hinge, not the options:

> Will this table gain more than these four props in the next month?

beats "extend or new component?". The human answers a fact in seconds; the recommendation follows from it. A shared abstraction forced past its shared rule is the classic cost of not asking.

## 3. Show, don't tell

Give every option a preview the reader can take in at a glance:

- the call site as it would read under each option;
- a before and after type signature;
- an ASCII sketch of the flow or state machine;
- a table when there are more than two options or more than two criteria.

Use the host's question interface with per-option previews where it has one (AskUserQuestion). When the decision is visual (UI, layout, a state machine too big for a sketch), render a comparison page or artifact where the host supports it instead of describing it.

## 4. One decision per unit, answer first

Lead with the recommendation, then the measured evidence, then the preview. Keep prose to about five lines per decision; anything longer belongs in the preview or the table. Make mechanical choices silently and list them as assumptions, so the human's attention goes to the forks that need it.

## 5. Record it, and keep the context

Write each resolved decision into the plan's decision log:

```markdown
- **Extend DataTable or new component?** Chose: new `ReportTable`. Decided by: <who>, 2026-09-23.
  Why: the table grows to about ten props over October (roadmap), past DataTable's shared rule.
  Measured: extend = 4 props, 23 call sites untouched; new = 1 file, duplicates sort and paging (~60 lines).
  Flips if: the October work is cut.
```

When the answer came from context the repository lacks, offer once to write that context where future agents read it: the project's AGENTS.md, a roadmap or direction doc, or the agent's memory file. The next session then starts with what this one had to ask for.

A handoff plan and the PR description carry the log, so reviewers and teammates see why, not only the diff.
