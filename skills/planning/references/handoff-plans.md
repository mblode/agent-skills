# Handoff plans

Read when a fresh session, a subagent, a teammate, or a cleared context will execute the plan. In Claude Code, approving a plan with the clear-context option or starting a new session to implement makes every plan a handoff plan; only a plan executed in the same conversation that wrote it is exempt.

## Why the executor is a stranger

The executor has not seen the interrogation. Every decision the user made in chat, every file the planner read, and every convention the planner noticed exists only in a context the executor does not have. The plan is the whole briefing. Anthropic's guidance for specs handed to a fresh session says the same: the useful ones "name the files and interfaces involved, state what is out of scope, and end with an end-to-end verification step that proves the feature works."

## What to inline

- Code excerpts the executor must match, with `file:line` markers, trimmed to the decision-rich part (a type, a schema, a function signature, a state machine). Prose describing a contract drifts; the code does not.
- Conventions the codebase follows that a grep would not reveal: naming, where tests live, which helper to reuse, which module must not be imported from.
- The verification commands and their expected output, copied from the Verification section, so the executor can run them without reading anything else.

## STOP conditions

Assumptions that, if false, mean stop and report back rather than improvise. Each one is checkable in advance by the executor:

```markdown
## STOP conditions

Stop and report instead of continuing if any of these is false when you check it:

- `src/auth/session.ts` still exports `refreshToken(userId)` with a single argument
- The `users.email` column has a unique index (`\d users` in psql)
- `npm test -- --reporter=dot` passes on `main` before any change
```

A STOP condition names the assumption and how to check it. "If anything looks off" is not a STOP condition; the executor cannot check it.

## Finish line

A plan that says what trips a STOP but never what an acceptable finish looks like leaves an executor that trips nothing patching past the point the work stopped converging. State the finish as one of three outcomes:

- The capability works on the real path and the case that motivated the plan improved (name the command or observation that shows it).
- A genuine blocker was removed and the next one isolated (name it).
- The run stopped because finishing needs scope the plan does not cover (name the scope).

## Implementation-notes file

Name a notes file next to the plan (`<plan>.notes.md`) and instruct the executor to keep it. Two headings:

```markdown
## Deviations

- Plan said: <what the plan specified>
  Code required: <what the codebase forced>
  Taken: <the option chosen, and why it is the conservative one>

## How the run ended

<one of the three finish outcomes, with the evidence>
```

A deviation that is not a STOP condition never pauses the work: take the conservative option, log it, keep going. The notes file is what review reads afterwards; a handoff without one loses every decision made during execution, and the reviewer has only the diff to reconstruct them from.

## Reviewing the result

After implementation, the adversarial check is a fresh subagent reading only the diff, the plan, and the notes file: every requirement implemented, every listed edge case tested, nothing outside the plan's scope changed. Tell it to report gaps that affect correctness or the stated requirements, not style; a reviewer asked to find gaps will find some, and chasing every one over-engineers the result.
