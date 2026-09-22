---
name: backlog
description: Drives a large backlog through parallel coding agents without drowning review. Splits work into review-sized vertical slices with native dependency links, writes self-contained handoffs, dispatches across agent lanes with WIP capped at review capacity, keeps a ledger as the source of truth, catches stalled agents, budgets every long-running goal, and runs a weekly retro that turns agent failures into rules and gates. Use when asked to "split this into tickets", "break down this epic", "dispatch these tickets", "run the backlog with agents", "fan this out", "what's stalled", "agent status", "which model should coordinate", "run this /goal overnight", "weekly agent retro", or "grill me on this plan". For a single-feature plan use the host's plan mode; for hooks and CI gates use gates; for opening or watching the PR use ship; for code review use tidy; for architecture use architecture.
---

# Backlog

Parallel agents multiply whatever goes in. "100 PRs by 7pm; main broke twice; the agents did exactly what I asked." This skill keeps the input small, the queue shorter than review can absorb, and the state somewhere other than the coordinator's context.

- **IS:** splitting work into review-sized slices, writing handoffs a stranger can execute, dispatching them across lanes, keeping the ledger, detecting and re-dispatching stalls, setting budgets and stop conditions, the weekly retro, and interviewing to settle a frame before splitting.
- **IS NOT:** a single-feature plan that fits one PR (the host's plan mode does that), architecture contracts and decision records (`architecture`), installing hooks, CI gates, or PR size limits (`gates`), opening, watching, or merging a PR (`ship`), reviewing a diff (`tidy`).

## Shared contract

Every mode works to these; they are the observed failures of parallel agent work, not preferences.

- **The ledger is the engine, the coordinator is the interface.** State lives in the tracker or `docs/ledger.md`, updated from observed evidence (tracker, `gh pr list`, CI runs). A fresh session given only the ledger must be able to continue.
- **WIP is review capacity.** Dispatched plus in-review never exceeds what the reviewers can review in a day. More agents past that only lengthen the queue.
- **Every ticket is smaller than a review.** It fits the PR size limit `gates` installs and one fresh context window.
- **Every long-running goal has a budget and a stop condition** written into its prompt and its ledger row.
- **Main red stops dispatch and merges.** The only work dispatched is the fix.
- **The reviewer is never the author's model.** Review goes cross-vendor, plus `tidy`.

## Modes

| Mode | Triggers | Done when | Read |
|------|----------|-----------|------|
| **Split** | "split this into tickets", "break down this epic", a plan with more than one shippable outcome | The breakdown is approved, tickets are published blockers-first with native blocking links and the ticket contract, and each has a ledger row in `ready` | `references/splitting.md`, `references/tickets.md` |
| **Dispatch** | "dispatch these", "run the backlog", "fan out", "start the agents", a `/goal` or overnight run | Every free WIP slot holds a ticket whose blockers are merged, with a lane, a handoff, a budget, and a `dispatched` row; the rest stay `ready` with the reason | `references/dispatch.md`, `references/routing.md`, `references/handoff-plans.md` |
| **Status** | "where are we", "what's stalled", "agent status", resuming a coordinator | The ledger matches observed state, stalls are re-dispatched or escalated, and a one-screen summary lists what waits on a human | `references/dispatch.md`, `references/claim-verification.md` |
| **Retro** | "weekly retro", "why do the agents keep doing X", end of a batch | Each observed failure has evidence and a brake: a gate, an instruction line, a ticket-contract change, or a routing change | Retro below |
| **Interview** | "grill me", "stress-test this plan", an unsettled frame before Split | Decisions are written into the plan or ticket file; open ones are listed at the step they block | `references/interrogation-protocol.md`, `references/claim-verification.md` |

A request that is one feature and one PR goes to the host's plan mode; say so and stop. A plan that turns out to hold several shippable outcomes enters Split.

## References

| File | Read when |
|------|-----------|
| `references/splitting.md` | Split mode: slicing, blocking edges, expand and contract, approval, publishing to a tracker or `docs/ledger.md` |
| `references/tickets.md` | Split mode, and any time a ticket is written or repaired: the ticket contract and template |
| `references/handoff-plans.md` | Dispatch: writing the brief a fresh agent executes, STOP conditions, finish line, notes file |
| `references/dispatch.md` | Dispatch and Status: ledger schema and states, WIP, stall rules, goal budgets, fan-out caps, merge conflicts, main red |
| `references/routing.md` | Choosing a lane or a model for a ticket, a coordinator, a reviewer, or a triage step. The only file in this skill that names models; it is dated, so check it against live sources |
| `references/claim-verification.md` | An agent or a plan claims something checkable ("done", "tests pass", "nothing calls this") before the ledger or the plan relies on it |
| `references/interrogation-protocol.md` | Interview mode, or a consequential choice is unresolved |

## Pre-approved loops

These run without asking because they read shared state or write only to the working tree and the agents' own sessions:

- Reading the tracker, PRs, CI runs, and agent session logs; reconciling the ledger from them and writing `docs/ledger.md` or ledger fields.
- Drafting tickets and handoffs locally, and revising a breakdown the user is reviewing.
- Dispatching `ready` tickets into free WIP slots once the breakdown is approved, and re-dispatching a stalled ticket inside its budget; the budget is the authorization.
- Marking a ticket `stalled`, `parked`, or `failed` on the evidence in `references/dispatch.md`.

Ask first: publishing an unapproved breakdown to a shared tracker (other people and runners see it at once), raising WIP above review capacity, extending a budget, anything that spends beyond the plan the user is on, merging, and closing or rewriting someone else's ticket.

## Retro

Weekly, or at the end of a batch. Input is the ledger, reverted PRs, review comments, main-red incidents, and stall notes, not recollection. For each failure write one row: what happened, the PR or run that shows it, and the brake. A failure seen twice gets an exit code (route to `gates`), not a sentence; a one-off gets an AGENTS.md line or a ticket-contract change; a lane that stalled or gamed tests gets a `references/routing.md` change with the date. Report throughput, median time to first review, WIP against capacity, stalls, re-dispatches, and hours main was red. Done is the rows written and the brakes either landed or ticketed.

## Gotchas

- A coordinator's context is not state. After compaction or a restart it re-dispatches merged work or forgets a parked ticket; rebuild from the ledger, never from memory, and compact long-running coordinators on purpose.
- Orchestrators have been observed to end a turn announcing "the next step is X" and then stop. Treat a final message that names a next step without a tool call as a stall, not progress.
- A `/goal` with no budget spiralled for 48 hours across three quota resets. Write the wall-clock, quota, and attempt caps into the goal prompt itself.
- A verify workflow fanned out 87 concurrent verify steps. Cap fan-out in the workflow, not in the prompt.
- Agents deviate from 20-step prescriptive handoffs in well-reasoned ways. Hand over the outcome, the acceptance check, and the STOP conditions; keep step lists for fragile commands only.
- AI PRs wait about 5x longer for pickup and are about 2.6x larger at p75 (LinearB 2026). Queue wait grows as 1/(1 - utilisation): past the knee, one more agent adds hours, not throughput.
- A blocker that only means "related" parks a ticket a runner would otherwise start, silently. A blocker is only what makes the ticket impossible to build or verify.
- A plan in `~/.claude/plans/` or a skill copied into another folder is invisible to other checkouts and drifts; an agent read a stale copy of a skill. Durable handoffs and the ledger live in the project.
- An agent's "tests pass" can be a cached run. The ledger moves to `in_review` on a fresh run's evidence, not on the claim.

## Related skills

- `gates`: the PR size limit, hooks, required checks, and check-the-check audits this skill's WIP and retro depend on.
- `ship`: opens the PR with the Risk and Proof section and watches it to merge.
- `tidy`: the review lane's second pass.
- `architecture`: contracts and decision records a split must respect.

Maintenance only: `evals/evals.json` holds the behavioural scenarios and routing prompts for anyone changing this skill. It never loads during a user task.
