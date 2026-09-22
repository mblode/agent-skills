# Dispatch and the ledger

The ledger is the state machine; the coordinator only reads it, moves rows on evidence, and talks to the human. Anything not in the ledger did not happen.

## Contents

- Ledger schema
- States and transitions
- WIP limit
- Stall rules
- Goal budgets
- Fan-out caps
- Merge conflicts
- Main is red

## Ledger schema

Use the tracker's native fields when a tracker is chosen (Linear or GitHub Issues: status, assignee, linked PR, blocked-by, labels for lane and budget). With no tracker, `docs/ledger.md` in the repository, one table:

```markdown
| id | title | state | lane | author model | session | PR | blocked by | budget | attempts | last evidence | note |
|----|-------|-------|------|--------------|---------|----|------------|--------|----------|---------------|------|
| 07 | CSV export streams rows | dispatched | implement | <model> | <link> | | 03 | 2h, 2 attempts | 1 | 14:05 commit a1b2c3 | |
```

`last evidence` is a timestamp plus what was observed (a commit, a CI run, a PR comment), never "agent says". `author model` is what lets Review stay cross-vendor.

## States and transitions

| From | To | Who | Evidence required |
|------|----|-----|-------------------|
| ready | dispatched | coordinator | WIP slot free, every blocker merged, main green, handoff written, budget set |
| dispatched | in_review | coordinator | PR open with the Risk and Proof section, required checks green on a fresh run |
| dispatched | stalled | coordinator | Any stall rule below |
| stalled | dispatched | coordinator | New session from the ticket and its notes file, attempts + 1, still inside budget |
| stalled | failed | coordinator | Budget or attempt cap reached; a human decides re-split, re-lane, or drop |
| in_review | dispatched | reviewer | Changes requested; same session if it is alive, fresh one otherwise |
| in_review | merged | human | PR merged; read the merge from the PR, not the agent |
| any | parked | coordinator | Main red, review queue full, or a blocker reopened; the note names which |

`blocked` is not a state: a ticket with an open blocker stays `ready` and is skipped.

## WIP limit

WIP = dispatched + in_review ≤ PRs the reviewers can review in a working day. Measure it from the last retro (PRs reviewed per reviewer per day at the size limit). With no history, start at 3 per reviewer and let the retro move it. Forty ready tickets and one reviewer means three or so in flight and thirty-seven `ready`, not forty agents: the other thirty-seven PRs would wait, go stale against main, and conflict with each other. Garden-lane PRs inside the auto-approval rules count as half a slot; everything else counts as one.

## Stall rules

A `dispatched` ticket is `stalled` when any holds:

- The agent's last message names a next step without a tool call ("the next step is to run the tests").
- No commit, push, or tool activity for 30 minutes on an active session, or twice the ticket's time estimate.
- The same failing command with the same error three times in a row.
- The budget is spent.

Re-dispatch into a fresh session with the ticket, the handoff, and the notes file, not "continue" into the polluted context. A stall that is really a missing decision goes to the human with the question, not back to an agent.

## Goal budgets

Every long-running goal (a `/goal`, a loop, an overnight run, a coordinator left alone) carries, in its prompt and its ledger row:

- Wall-clock cap, and a quota cap (stop before a second quota reset).
- Attempt cap per ticket (default 2) and a total ticket cap for the run.
- Stop conditions: done evidence reached, a STOP condition from the handoff, main red, WIP full with nothing reviewable, budget spent.
- What to leave behind on stopping: the ledger reconciled and a one-screen status.

A goal with no cap is not autonomous, it is unbounded.

## Fan-out caps

Concurrent agents ≤ WIP. Concurrent steps inside one workflow (verify, test, lint fan-outs) are capped in the workflow definition, typically at the runner's core count; a prompt that says "don't overdo it" is not a cap.

## Merge conflicts

- Tickets whose expected touch sets overlap on a hot file are serialized: dispatch one, keep the other `ready` with a `conflicts with 07` note. Not a blocker; it becomes dispatchable the moment 07 merges.
- The author lane rebases on the latest main; the coordinator does not hand-merge.
- Lockfiles and generated files are regenerated, never merged by hand.
- A PR that conflicts twice goes back to Split: it is too wide, or it is a wide refactor that needs expand and contract.

## Main is red

Stop dispatching and stop merging. Dispatch one ticket, the fix, at the top of the queue, from the failing run's evidence. Park everything that was about to merge. Resume when a fresh (uncached) run on main is green. Record the red interval for the retro.
