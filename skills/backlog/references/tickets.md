# Ticket contract

A ticket is the whole briefing for an agent that has never seen the conversation, and the unit a reviewer reviews. If a field cannot be filled, the ticket is not ready.

| Field | Contract | Fails when |
|-------|----------|------------|
| **Outcome** | The behaviour that works when the ticket closes, from the user's side | It names a layer ("add the API") or a phase |
| **Acceptance check** | A command or observation plus the expected result, runnable by someone holding only the diff and the repo; include the failure case ("returns 403 for another tenant's id") | "Works correctly", "tests pass", or a check that would pass before the change |
| **Files and interfaces** | The expected touch set and any interface the ticket must match, as paths; a schema or type shape inline when it encodes a decision | Missing, so conflict detection and review scoping have nothing to use |
| **Size limit** | Fits the PR size limit `gates` installs and one fresh context window | The acceptance check cannot be named in one line, or the touch set spans unrelated areas |
| **Dependencies** | Native blocked-by links to tickets that make this one impossible to build or verify | A "related" ticket is listed as a blocker |
| **Lane** | Implement, garden, or think-hard, from `routing.md`; the review lane is chosen at review time as a different vendor | Missing, so the coordinator picks by habit |
| **Budget** | Time and attempts, plus the goal caps when it runs unattended | Missing on anything dispatched overnight |
| **STOP conditions** | Assumptions checkable in advance that, if false, mean report instead of improvise | "If anything looks off" |
| **Recovery** | Rollback or down path for migrations and irreversible writes | A migration ticket without one |

The repository's standing bar (typecheck, lint, tests, hooks) is not an acceptance check; `gates` enforces it for every ticket. Spend criteria on what makes this slice correct.

## Template

```markdown
# <NN> <Outcome as a title>

**Outcome:** <behaviour that works when this closes>
**Blocked by:** <ids, or none>
**Lane:** <implement | garden | think-hard>  **Budget:** <2h, 2 attempts>

## Acceptance
- [ ] `<command>` -> <expected result>
- [ ] <failure-case observation> -> <expected result>

## Touches
- `<path>` (<interface or schema to match, if any>)

## STOP if
- <checkable assumption> (check: `<command>`)

## Out of scope
- <adjacent change a reader would plausibly mistake for scope>
```

Length follows the ticket: drop Recovery and Out of scope when nothing plausible belongs there.
