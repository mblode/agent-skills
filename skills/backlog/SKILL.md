---
name: backlog
description: Runs an already-split backlog through parallel coding agents without drowning review. Keeps a ledger as the source of truth, caps work in flight at review capacity, picks a lane and model per ticket, catches stalled agents, budgets long-running goals, and runs a weekly retro. Use when asked to "dispatch these tickets", "run the backlog with agents", "what's stalled", or "weekly agent retro". To split work into tickets use planning.
---

# Backlog

Parallel agents multiply whatever goes in: "100 PRs by 7pm; main broke twice; the agents did exactly what I asked." Keep the queue shorter than review can absorb, and keep the state somewhere other than the coordinator's context.

- **IS:** dispatching ready tickets, keeping the ledger, detecting and re-dispatching stalls, budgets and stop conditions, lane choice, and the weekly retro.
- **IS NOT:** splitting work into tickets or writing handoffs (`planning`), installing hooks and PR size limits (`gates`), opening or watching PRs (`pr-creator`, `pr-babysitter`), reviewing a diff (`tidy`).

## Rules

- **The ledger is the engine.** State lives in the tracker or `docs/ledger.md`, moved only on observed evidence (a commit, a CI run, a merged PR), never on "agent says". A fresh session given only the ledger can continue.
- **WIP equals review capacity.** Dispatched plus in-review never exceeds what the reviewers clear in a day.
- **Every long-running goal has a budget** (wall clock, attempts, quota) and a stop condition written into its prompt and its ledger row.
- **Main red stops dispatch.** The only ticket dispatched is the fix.
- **The reviewer is never the author's model.**

## Done

- **Dispatch:** every free WIP slot holds a ticket whose blockers are merged, with a lane, a budget, and a ledger row; the rest stay `ready` with the reason.
- **Status:** the ledger matches observed state, stalls are re-dispatched or escalated, and one screen lists what waits on a human.
- **Retro:** each failure this week has evidence and a brake. Seen twice becomes a gate (`gates`); once becomes an AGENTS.md line; a lane that stalled or gamed tests changes `routing.md`.

| File | Read when |
|------|-----------|
| `references/dispatch.md` | Ledger schema and states, WIP, stall rules, goal budgets, fan-out caps, merge conflicts, main red |
| `references/routing.md` | Choosing a lane or model. The only file here that names models; it is dated, so re-check it |

Pre-approved: reading the tracker, PRs, CI, and session logs; updating the ledger; dispatching `ready` tickets into free slots and re-dispatching a stall inside its budget. Ask first: raising WIP, extending a budget, spending beyond the user's plan, merging, publishing tickets to a shared tracker.

## Gotchas

- A final message that says "the next step is X" with no tool call is a stall, not progress.
- A `/goal` with no budget ran for 48 hours across three quota resets. Put the caps in the goal prompt.
- A verify workflow fanned out 87 concurrent steps. Cap fan-out in the workflow, not the prompt.
- Agents drift from 20-step handoffs in well-reasoned ways. Hand over the outcome, the acceptance check, and STOP conditions.
- Queue wait grows as 1/(1 - utilisation): past the knee, another agent adds hours, not throughput.
- After compaction a coordinator re-dispatches merged work. Rebuild from the ledger, not memory.

Maintenance only: `evals/evals.json` holds scenarios and routing prompts for anyone changing this skill.
