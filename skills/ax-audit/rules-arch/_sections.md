# Sections: Agent-Native Architecture (Layer 1)

The 4 categories of agent-native architecture (Layer 1) audit rules. Each rule file uses one category prefix.

---

## 1. Parity (parity)

**Default tier:** mostly release-blocker
**Why critical:** If the agent can't do what the user can do, it's a second-class citizen. Gaps surface as "why can't the agent do X?" with no workaround. Missing CRUD operations strand agents mid-workflow.

## 2. Granularity (granularity)

**Default tier:** mostly fix-this-sprint; release-blocker for raw substrate access
**Why critical:** Tools that bundle decision logic force the agent to accept or reject a whole workflow; atomic primitives let it apply judgment at each step. If behavior changes need code refactoring instead of prompt edits, granularity is too low. The opposite failure is a tool whose action space is unbounded: a schema that can express an invalid action, or a raw eval, shell, or query passthrough that makes every other tool boundary advisory.

## 3. Context (context)

**Default tier:** mostly fix-this-sprint to backlog
**Why critical:** Context is a budget with two ends, and both ends cost accuracy. An agent that doesn't know what exists asks redundant questions and feels unintelligent; an agent handed every tool and every procedure on every run picks the wrong one from a longer list. Placement matters too, since a per-turn value ahead of the stable prompt discards the provider's prefix cache on every call.

## 4. Communication (comm)

**Default tier:** release-blocker for completion, progress and approval gates; fix-this-sprint for subagent attribution
**Why critical:** Silent agents feel broken. Heuristic completion detection creates race conditions. Missing progress indicators make users kill and restart tasks. An orchestrator with no gate on its execution path auto-executes whatever destructive tool is registered next, which is why the approval-gate rule blocks a release here rather than waiting a sprint. Fan-out adds a quieter version: a branch that failed and was filtered out reports as coverage that never happened.

---

## Rule index

```
parity-no-tool-parity             parity-crud-incomplete            parity-orphan-ui-action
granularity-workflow-shaped-tool   granularity-static-api-mapping    granularity-raw-primitive-escape
granularity-permissive-tool-schema
context-starvation                 context-no-injection              context-no-checkpoint-resume
context-unscoped-tool-surface      context-volatile-prompt-prefix
comm-no-completion-signal          comm-no-progress-visibility       comm-no-approval-gate
comm-no-subagent-attribution
```

Total: 16 rules.

---

## Cross-rule interactions

Within this layer, these pairs sit close enough to double-report. Pick one:

- **no-tool-parity + orphan-ui-action**: same defect, different scope. `parity-no-tool-parity` sweeps the shipped codebase; `parity-orphan-ui-action` looks only at the diff. A capability the PR introduced is the orphan finding; anything older is the parity finding, never both.
- **crud-incomplete + no-tool-parity**: `parity-crud-incomplete` is entity-level (this noun is missing an operation), `parity-no-tool-parity` is handler-level (this endpoint has no tool). A missing `update_note` matches both: report the CRUD finding, which names the operation.
- **workflow-shaped-tool + static-api-mapping**: opposite ends of one axis. Too coarse (one tool making domain decisions) versus too many too-thin tools (one per endpoint, no discovery). They should not fire on the same tool; if they do, re-read the tool.
- **raw-primitive-escape + permissive-tool-schema**: both say the action space is unbounded, at different layers. A `z.string()` where an enum belongs is the schema finding; a tool whose whole input is code or a query is the substrate finding. An `eval(code: string)` tool matches both greps: report the substrate finding, which names the real blast radius.
- **raw-primitive-escape + workflow-shaped-tool**: these look like opposites and are not. Dropping a substrate tool does not mean bundling its callers into a workflow tool; it means adding a bounded domain tool for the gap. If removing the first is about to trip the second, the replacement is shaped wrong.
- **context-starvation + context-no-injection**: one static prompt trips both greps. Report `context-starvation` for the missing what-exists block, and `context-no-injection` only when cross-session state is separately absent.
- **context-starvation + context-unscoped-tool-surface**: the two ends of the context budget. A prompt can genuinely fail both, and it is worth reporting both, because the fix is one restructure (a small resident core plus on-demand procedures) rather than two opposing edits.
- **context-unscoped-tool-surface + context-volatile-prompt-prefix**: size versus placement. The first says too much ships every run; the second says what ships is ordered so none of it caches. Fixing placement does not shrink the prompt, and shrinking it does not fix placement.
- **comm-no-subagent-attribution + comm-no-progress-visibility**: a fan-out that emits nothing at all fails the progress rule, and attribution is moot until it does. Fix the emission first, then ask whether the events name their branch.
- **no-completion-signal + no-progress-visibility**: both audit the orchestrator's event contract, at the end of the run and during it. A loop that emits nothing fails both; fix the emission once and re-run.

Across layers, `rules-arch` owns the code path and `rules-ax` owns what the user sees on it:

- **comm-no-approval-gate (arch) + control-no-approval-gate (ax)**: the gate exists on the execution path versus the treatment matches the stakes. Fix the arch finding first; without a checkpoint there is nowhere to put the ax fix.
- **comm-no-progress-visibility (arch) + comm-no-progress-signal (ax)**: emission versus presentation. If the server returns one final payload, only the arch rule fires and no component change can resolve it. If events stream and the UI ignores them, only the ax rule fires.
