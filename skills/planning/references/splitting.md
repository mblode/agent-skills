# Splitting work into slices

The exit from Create mode when the work is too big for one plan, and from Review mode when Scope cannot reach 5/5 because the plan is really two plans. The output is a set of **vertical slices**, one ticket each, every ticket declaring what blocks it.

## Contents

- When to split
- Draft the slices
- Wide refactors: expand and contract
- Confirm granularity before publishing
- Publish the slices
- Ticket shape
- What a fan-out runner reads
- Anti-patterns

## When to split

Split when any of these hold:

- The interrogation passed 10 questions without converging. More detail buys nothing: the plan cannot be executed in one pass.
- The plan has more than one shippable outcome. Two things a user could notice separately are two plans.
- Nothing can be verified until the last step lands. A plan whose Verification section only runs at the end is a stack of layers, not a plan.
- Review keeps Scope below 5/5 because items serve different goals and cutting either one drops a current requirement.

Do not split to escape the interrogation. Slicing needs the same understanding a single plan needs: intent, scope, and the frame settled first. Split before the frame is settled and you slice the wrong axis, then every slice inherits the mistake.

Splitting is also wrong when the pieces are only sequential steps of one small change. Two tickets that a single agent would do in one sitting cost two worktrees, two reviews, and two merges to buy nothing.

## Draft the slices

Each slice is a **tracer bullet**: a narrow but complete path through every layer the change touches (schema, API, UI, tests), never a horizontal slice of one layer.

- A finished slice is demoable or verifiable on its own, on the main branch, with no other slice merged.
- Each slice fits one fresh context window: an agent that has never seen this conversation can read the code it touches, make the change, and run the verification without running out of room. If you cannot name the single command or observation that proves the slice, it is too big or too horizontal.
- Prefactoring comes first, as its own slice. Make the change easy, then make the easy change.
- Slice titles name the behaviour that works when the ticket closes, not the layer it edits.

Then give each slice its **blocking edges**: the slices that must finish before it can start. A slice with no blockers starts immediately.

A blocker is a slice whose absence makes this one impossible to build or impossible to verify. A slice that merely touches the same files is not a blocker. Get this wrong in the loose direction and it is expensive: a fan-out runner skips any ticket whose blockers are still open, so one decorative edge parks work that could have started, silently, until a human notices the ticket never picked up. Aim for a shallow graph: most slices unblocked, one chain where the dependency is real.

## Wide refactors: expand and contract

A **wide refactor** is one mechanical change (rename a column, retype a shared symbol) whose blast radius fans across the codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. This is the one exception to vertical slicing. Do not force it into a tracer bullet; sequence it instead:

1. **Expand:** add the new form beside the old one so nothing breaks. One ticket, no blockers.
2. **Migrate:** move the call sites over in batches sized by blast radius (per package, per directory). Each batch is its own ticket blocked by the expand, and each stays green because the old form still exists.
3. **Contract:** delete the old form once no caller remains. One ticket, blocked by every migrate batch.

When even the batches cannot stay green alone, keep the sequence but let them share an integration branch, and add a final integrate-and-verify ticket blocked by all of them. Green is promised only there, and the tickets must say so.

## Confirm granularity before publishing

Present the proposed breakdown as a numbered list. For each slice show:

- **Title:** short, names the outcome
- **Blocked by:** the slices that gate it, or "none"
- **What it delivers:** the end-to-end behaviour that works once it closes

Then ask three questions:

- Does the granularity feel right, too coarse or too fine?
- Are the blocking edges real, or is anything listed that merely touches the same area?
- Should any slices merge or split further?

Iterate until the human approves. Publish nothing before then: tickets are visible to other people and to any fan-out runner watching the tracker, so an unapproved breakdown is not a draft, it is work already dispatched.

## Publish the slices

You write the tickets yourself, exactly as you open a PR. Nothing downstream writes to a tracker; a fan-out runner only reads what you published.

Publish in dependency order, blockers first, so each ticket's edges can reference identifiers that already exist.

- **A real tracker (Linear, GitHub, ...):** one issue per slice. Set the tracker's **native** blocking relation ("Blocked by" on Linear), not just a line of prose. A runner reads the relation; a blocker that exists only in the description is invisible to it and the ticket will pick up early.
- **Local markdown files:** one file per slice at `<plan-dir>/slices/<NN>-<slug>.md`, numbered from `01` in dependency order, one ticket per file and never one combined file. There is no tracker to read the edges, so the `Blocked by` line is for the human driving pickup.

Do not modify or close the parent issue.

Finally, record the breakdown in the plan file under a `## Slices` heading: each slice's identifier or file path, its title, and its blockers. When the split happened during interrogation and no plan file exists yet, write the lightweight one now (title, context, approach) and put `## Slices` in it. Without that index the plan and the tickets drift apart the moment either changes, and Review has nothing to act on.

## Ticket shape

```markdown
# <NN> <Title>

**What to build:** the end-to-end behaviour this ticket makes work, from the
user's perspective. Not a layer-by-layer implementation list.

**Blocked by:** <the tickets that gate this one, or "none, can start immediately">

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
```

Every criterion must be checkable by someone holding only the diff and the repo. "Works correctly" is not a criterion; "the list still renders when the API returns 500" is.

Avoid file paths and code snippets: they go stale between publishing and pickup. The exception is a snippet that encodes a decision more precisely than prose can (a schema, a state machine, a type shape), trimmed to the decision-rich part.

## What a fan-out runner reads

A runner that picks these tickets up maps each one into a fixed contract, so write to it:

| Field | Comes from | Consequence |
|---|---|---|
| identifier | the tracker | how the human approves, rejects, and merges the run |
| title | the ticket title | names the worktree and the PR |
| description | the ticket body | passed verbatim as the contract the agent implements |
| criteria | the tracker's native sub-items (Linear sub-issues, checklist items) | one graded acceptance criterion each |
| blockedBy | the native blocking relation | open blockers mean the ticket is skipped, not queued |

Two consequences worth planning around. Sub-items are read as **acceptance criteria of their parent**, so do not make the slices sub-items of the epic and then dispatch the epic: dispatch the slices. And do not spend criteria on the repo's standing bar (tests pass, lint passes, a PR is open); that bar is constant and the runner already applies it. Criteria are for what makes *this* slice correct.

## Anti-patterns

- **Horizontal slices** titled "schema", "API", "UI". Nothing is demoable until the last one lands, and the first two cannot be verified at all.
- **"Phase 1 / Phase 2 / Phase 3"** titles. They encode order, which the blocking edges already carry, and hide the outcome.
- **Blockers used to mean "related"**. Every false edge parks a ticket a runner would otherwise have started.
- **Publishing before approval.** Retracting means deleting tickets other people have already seen.
- **A slice that only lands green on another slice's unmerged branch.** That is a wide refactor wearing a tracer bullet costume; sequence it as expand and contract instead.
- **Splitting instead of interrogating.** A breakdown built on an unsettled frame slices the wrong axis and multiplies the error by the number of tickets.
