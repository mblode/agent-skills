# Context Errors

The two mistakes a capable agent makes on a codebase it has not worked in: errors of ignorance and errors of paranoia. Both produce code that is competent, self-consistent, and locally defensible, which is exactly why a line-by-line pass over the diff approves them.

Every other rubric here judges the diff against itself. This one judges the diff against the system it landed in, so every finding rests on an artifact outside the changed lines: an existing module, a sibling implementation, a writer set, a consumer's tolerance. A finding without that artifact is a guess and reads as one.

## Contents

- Errors of ignorance
- Errors of paranoia
- Evidence bar
- Where review loops fail
- Reporting

## Errors of ignorance

The code is right and the context is wrong. Nothing inside the diff is broken, so the passes over added lines, removed lines, and call sites cannot reach these. Each check below names the search that produces its evidence; run the search before writing the finding.

### 1. Reimplemented module

New code whose behavior something in this repo already provides.

**Search:** the changed file's own directory, the nearest shared, lib, or utils directory, and the package's public exports. Grep for the distinctive verb or noun in the new function's name, then for the shape of what it returns.

**Evidence:** the existing function, its path, and one live call site proving it is the current path rather than a dead one.

### 2. Wrong home

The change works, and it landed outside the system that owns this class of behavior. The usual shape: validation added in a route handler where a validator layer exists, a permission check inline where a policy module exists, a formatting rule in a component where a shared formatter exists.

**Search:** find where the last two or three changes of the same class landed. `git log -S` on a distinctive symbol, or grep for the sibling cases the feature already has.

**Evidence:** the sibling. Two siblings living somewhere else make the third one's location the finding.

### 3. Convention divergence

Naming, error handling, data access, or module boundaries that differ from the files around them. The standard is what the neighbors do, not what is idiomatic in the language. A scoped `AGENTS.md` or `CLAUDE.md` rule outranks both.

**Evidence:** two or more sibling files doing it the other way. One neighbor is a coincidence, not a convention.

### 4. Duplicate concept under a new name

One domain rule given a second type, enum, status set, or constant. Both are correct today, and the rule now has two owners, so the next change to it lands in one of them.

**Evidence:** the existing definition and the value that appears in both.

### 5. Unowned surface

A config key, environment variable, feature flag, migration, or route added without the registration path the existing ones take: a registry, a schema, a typed config object, a deploy manifest, a docs table. The diff works locally and the surface is invisible to whatever was supposed to know about it.

**Evidence:** an existing member of the same surface, and the file where it is registered.

**A search returning nothing is not evidence here.** For dead code the risk is calling something dead when a dynamic import reaches it; for ignorance the risk runs the other way, and an empty grep means the search was wrong at least as often as it means the module is absent. Widen the search or drop the finding.

## Errors of paranoia

Code that is correct, handles a state cleanly, and exists for a state this system does not produce. Distinct from the defensive-excess and unnecessary-error-handling entries in `ai-slop-patterns.md`, which fire when the type system already rules the state out. These fire when the type allows the state and the deployment never reaches it, so the evidence is never in the type signature.

### 1. Redundant validation of a settled value

A value set once from config, a constant, or a boot-time argument, re-validated at every use.

**Evidence:** the writer set. Grep every assignment. Nothing writing it after startup means one check at the boundary is the whole requirement.

### 2. Freshness engineering past the consumer's tolerance

Invalidation, subscriptions, or polling added so a value is never stale, where the consumer tolerates the staleness the simpler path already gives.

**Evidence:** the consumer and the tolerance it actually has: a render the user cannot observe inside a second, a report already batched hourly, a check re-run on the next request anyway.

### 3. Graceful degradation where crashing is correct

Fallbacks, default return values, and swallowed exceptions in a process that is restarted on failure (a CLI, a job, a pod, a queue consumer, a request handler) or where the degraded output is worse than none. The failure was loud and fixable; it is now a quiet wrong answer with no stack trace.

**Evidence:** the supervisor or retry that already handles the crash, or the caller that cannot distinguish the fallback value from a real one.

### 4. Rollback machinery for a step that does not need it

Compensation logic wrapped around an operation that is idempotent, transactional, or has no external effect to undo.

**Evidence:** the transaction boundary or the idempotency key that already makes the step safe to repeat.

### 5. Concurrency defense on a single-writer path

Locks, mutexes, version columns, or optimistic-concurrency retries on a path with one writer.

**Evidence:** every caller, and the deployment shape (single worker, serialized queue, per-key partition) that keeps them from overlapping.

## Evidence bar

The asymmetry inverts here. For a correctness finding, the cost of being wrong is a sentence the reviewer spends dismissing it, so plausible is worth reporting. Acting on a paranoia finding deletes a guard, and the cost of being wrong is a bug. So the two halves of this file have different defaults.

| Finding | Evidence required | Default without it |
|---------|-------------------|--------------------|
| Reimplemented module | Existing function, path, live call site | Drop it |
| Wrong home | A sibling change of the same class, and where it landed | Report as plausible |
| Convention divergence | Two sibling files doing it the other way | Drop it |
| Duplicate concept | The existing definition | Drop it |
| Unowned surface | An existing member and its registration site | Report as plausible |
| Any paranoia finding | The named reason this system never reaches the state | The guard stays |

## Where review loops fail

- **A second model shares the failure mode, not just the training data.** Two agents reviewing the same diff have the same missing context, so both approve the reimplementation neither one opened and both accept the same guard. Agreement between them on an ignorance or paranoia call corroborates nothing; only the artifact does.
- **Watch the sequence, not the round.** A loop is converging when findings resolve. It is generating work when findings move rather than close, when the guard count climbs while the reported severity falls, and when each round leaves the diff longer than it found it. Judge that across rounds; no single round looks wrong.
- **The simpler shape does not surface on its own.** "Delete this and accept the risk" is a judgement about the system, not a defect in the diff, so a pass built to find defects will never propose it. Where a paranoia finding survives a round of fixes, or a fix keeps returning in a new form, putting the smaller shape to whoever owns the system, with the risk named in one line, is usually worth more than another round.

## Reporting

Use `SKILL.md`'s finding format with one added line, `Context:`, naming the artifact the finding rests on.

```markdown
- [major] `src/api/orders.ts:118` Order status re-defined instead of using the shared enum
  Why: `OrderStatus` in `src/domain/order.ts:12` already owns these five values, so the rule now has two owners and the next status change lands in one of them.
  Fix: Import `OrderStatus` and delete the local union.
  Context: `src/domain/order.ts:12`, imported by `src/domain/order-state.ts:8` and three other call sites.

- [minor] `src/workers/sync.ts:64` Retry wrapper around an already-idempotent write
  Why: The write is keyed by `syncId` and the worker is restarted by the supervisor on failure, so the wrapper adds a second retry policy that hides which one fired.
  Fix: Delete the wrapper and let the write fail.
  Context: idempotency key set at `src/workers/sync.ts:41`; restart policy in `deploy/worker.yaml:22`.
```

Severity:

- An ignorance finding is major when it creates a second owner for a rule or puts logic where the next change will not look for it. It is minor when the effect is local style.
- A paranoia finding does not belong under `Must fix before push` on its own. It is code to delete, not a defect, and shipping it costs lines rather than correctness. It goes under `Should fix soon` unless the guard itself introduces a bug.
