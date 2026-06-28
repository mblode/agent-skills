# Doc grounding

Ground the plan in the documentation that already encodes decisions, then grill the rationale. Load during Step 1 when design docs, RFCs, ADRs, or library/API docs are relevant to the request.

## Contents

1. [Where to find docs](#where-to-find-docs)
2. [Extract the core decisions](#extract-the-core-decisions)
3. [Turn decisions into grilling questions](#turn-decisions-into-grilling-questions)
4. [Anti-patterns](#anti-patterns)

## Where to find docs

Look in order of authority, closest to the code first:

| Source | Where | What it tells you |
|---|---|---|
| ADRs / decision records | `docs/adr/`, `docs/decisions/`, `*.adr.md` | Why a choice was made, what was rejected, the tradeoff |
| Design docs / RFCs | `docs/`, `rfcs/`, linked in PRs or issues | Intended approach, constraints, open questions |
| READMEs | repo root, package roots | Conventions, setup assumptions, supported usage |
| Inline contracts | doc comments, `types`, schema files | The real interface vs the documented one |
| Library / API docs | the dependency's official docs | Supported APIs, deprecations, recommended patterns |
| Specs the user points to | wherever the user names | The source of truth for this work |

If the repo has no docs, say so and fall back to code-only grounding. Never invent doc content.

## Extract the core decisions

For each relevant doc, pull out the **decisions**, not the prose. A decision has three parts:

- **Choice:** what was decided ("use optimistic locking", "single Postgres instance", "JWT in HttpOnly cookie")
- **Rationale:** why ("avoids lock contention at our write volume")
- **Validity window:** what would make it wrong ("only holds under ~100 writes/sec")

Capture them compactly:

```
DECISION: <choice>
WHY: <rationale, quoted or paraphrased from the doc>
HOLDS WHILE: <the condition that keeps it valid>
SOURCE: <file:line or doc name>
```

Skip anything the doc states that isn't load-bearing for this plan.

## Turn decisions into grilling questions

A decision becomes a question only when this work could invalidate it. Pressure-test the rationale and the validity window, not the choice itself.

| Decision pattern | Grill it with |
|---|---|
| Approach chosen for a stated reason | "The RFC picked X because [reason]. Does that reason still apply to what we're adding?" |
| Constraint / limit | "The doc assumes [limit]. Does this change push past it?" |
| Rejected alternative | "They rejected Y for [reason]. Has anything changed that makes Y worth revisiting?" |
| Unstated assumption in the doc | "The design assumes [assumption] but never says so. Is that still true here?" |
| Doc contradicts the code | "The doc says X, the code does Y. Which is the source of truth for this plan?" |

Use the recommended-answer format from `interrogation-protocol.md`: name the doc, quote the decision, propose your read.

## Anti-patterns

- Summarizing the docs back to the user instead of extracting decisions. They wrote the docs; they don't need a recap, and it burns a turn without advancing the plan.
- Re-asking what a doc plainly answers. Read it, fold the answer into your grounding, move on.
- Treating a doc as current truth when the code diverges. Verify against the code, and flag the drift; planning against a stale doc bakes the drift into the plan.
- Grilling every decision. Only the ones this work could break are worth a question; the rest waste the 5-10 question budget.
