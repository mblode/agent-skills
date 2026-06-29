# Doc grounding

Ground the plan in documentation that already encodes decisions, then grill the rationale. Load during Step 1 when design docs, RFCs, ADRs, or library/API docs are relevant.

## Where to find docs

In order of authority, closest to the code first:

| Source | Where | What it tells you |
|---|---|---|
| ADRs / decision records | `docs/adr/`, `docs/decisions/`, `*.adr.md` | Why chosen, what was rejected, the tradeoff |
| Design docs / RFCs | `docs/`, `rfcs/`, linked in PRs or issues | Intended approach, constraints, open questions |
| READMEs | repo root, package roots | Conventions, setup assumptions, supported usage |
| Inline contracts | doc comments, `types`, schema files | Real interface vs the documented one |
| Library / API docs | the dependency's official docs | Supported APIs, deprecations, recommended patterns |
| Specs the user points to | wherever the user names | Source of truth for this work |

No docs in the repo? Say so and fall back to code-only grounding. Never invent doc content.

## Extract the core decisions

Pull **decisions** from each doc, not prose. Three parts:

- **Choice:** what was decided ("use optimistic locking", "single Postgres instance", "JWT in HttpOnly cookie")
- **Rationale:** why ("avoids lock contention at our write volume")
- **Validity window:** what breaks it ("only holds under ~100 writes/sec")

Capture compactly:

```
DECISION: <choice>
WHY: <rationale, quoted or paraphrased from the doc>
HOLDS WHILE: <the condition that keeps it valid>
SOURCE: <file:line or doc name>
```

Skip anything not load-bearing for this plan.

## Turn decisions into grilling questions

A decision becomes a question only when this work could invalidate it. Pressure-test the rationale and validity window, not the choice itself.

| Decision pattern | Grill it with |
|---|---|
| Approach chosen for a stated reason | "RFC picked X because [reason]. Does that still apply to what we're adding?" |
| Constraint / limit | "Doc assumes [limit]. Does this change push past it?" |
| Rejected alternative | "They rejected Y for [reason]. Anything changed that makes Y worth revisiting?" |
| Unstated assumption in the doc | "Design assumes [assumption] but never says so. Still true here?" |
| Doc contradicts the code | "Doc says X, code does Y. Which is source of truth here?" |

Use `interrogation-protocol.md`'s recommended-answer format: name the doc, quote the decision, propose your read.

## Anti-patterns

- Summarizing the docs back to the user. They wrote them; a recap burns a turn without advancing the plan.
- Re-asking what a doc plainly answers. Read it, fold the answer into your grounding, move on.
- Treating a doc as current truth when the code diverges. Verify against the code and flag the drift; planning against a stale doc bakes it in.
- Grilling every decision. Only ones this work could break earn a question; the rest waste the 5-10 question budget.
