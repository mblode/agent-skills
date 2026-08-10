---
title: Fan-out reports one aggregate with no per-branch attribution
slug: comm-no-subagent-attribution
category: comm
defaultTier: fix-this-sprint
surfaces: agent-tool-execution, agent-dashboard
agent-native-principle: Parity (agent-UI communication)
detection: hybrid
related: comm-no-progress-visibility, comm-no-completion-signal, context-no-checkpoint-resume, comm-no-progress-signal
---

## Fan-out reports one aggregate with no per-branch attribution

The parent spawns several sub-runs, awaits them together, and emits one result. Nothing downstream can say which branch produced which finding, which branch is still running, or which one failed. A rejected branch resolves to null, gets filtered out, and the summary reads as complete coverage of work that never happened.

Scope: `comm-no-progress-visibility` asks whether the run loop emits step events at all. This rule assumes it does and asks whether those events carry a branch identity. A single-threaded agent cannot fail this rule.

## What goes wrong

A review agent fans one agent per file across a 30-file diff. Four sub-runs hit a rate limit and reject. The gather call collects results, drops the empty ones, and the parent reports "reviewed the diff, 6 findings". Six is the count from 26 files. Nobody learns that four were skipped, because the only place that fact existed was a rejected promise inside a `Promise.allSettled` nobody read.

## Detection

**Surfaces:** agent-tool-execution, agent-dashboard

**Static signals:**
1. Find fan-out sites: `Promise.all`, `Promise.allSettled`, a task queue, or a loop that spawns runs. Record file and line.
2. At each, check whether a branch identity (index, label, subject) is carried into the result, or whether results are positional only.
3. Check the settle handling. `.filter(Boolean)`, `.filter(r => r.status === "fulfilled")` or a bare `catch` with no re-emit collapses failures into silence.
4. Check whether events emitted during the fan-out carry that identity, so a consumer can attribute progress to a branch.
5. Fail when a fan-out drops branch identity or swallows a rejected branch. Record the site and how many branches it spawns.

**Concrete commands:**
```bash
rg -n '(Promise\.all|Promise\.allSettled|allSettled)' --type=ts src/
rg -n '\.filter\((Boolean|r => r\.status)' --type=ts src/
rg -n '(subagent|subAgent|spawnAgent|delegate|fanOut)' --type=ts src/
```

**Judgment signals:**
- A results array typed as `T[]` rather than `{ branch: string; result: T }[]` has already lost the attribution, whatever the UI does with it.
- Per-branch events that all share the parent's run id are indistinguishable downstream, which is the same defect one layer along.

**False-positive guards:**
- Skip files with `// ax-audit-ignore:comm-no-subagent-attribution`.
- Skip fan-out over homogeneous work where the branch is genuinely uninteresting, such as retrying one idempotent call three times.
- Skip sites that re-emit failures into the parent's result, which is the corrected shape.
- Skip test files and eval harnesses.

## Fix

Carry the branch through the result and report partial coverage as a first-class outcome rather than a shorter list.

```ts
// before: positional results, failures filtered away
const findings = (await Promise.all(files.map(review))).filter(Boolean).flat();

// after: identity survives, and so does the failure
const settled = await Promise.allSettled(files.map(review));
const branches = settled.map((r, i) => ({
  file: files[i],
  ...(r.status === "fulfilled" ? { findings: r.value } : { failed: String(r.reason) }),
}));
emit({ type: "fanout.complete", covered: branches.filter(b => !b.failed).length, total: files.length, branches });
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | fix-this-sprint |
| Agent dashboard | fix-this-sprint |

The rows do not taper. The defect is in the orchestrator's event contract, so a dashboard cannot render attribution the server never emitted, and neither surface can compensate for the other.

## Examples

**Anti-pattern (fails):** `const results = (await Promise.all(tasks)).filter(Boolean)` at the fan-out site, a `Finding[]` return type, and no event carrying a branch id between spawn and completion.

**Applied (passes):** results are `{ branch, findings | failed }`, the completion event reports `covered` against `total`, and the summary says which branches were skipped.

## Suppression

```ts
// ax-audit-ignore:comm-no-subagent-attribution, three retries of one idempotent read, the branch carries no meaning
const [a] = await Promise.all([fetchOnce(), fetchOnce(), fetchOnce()]);
```
