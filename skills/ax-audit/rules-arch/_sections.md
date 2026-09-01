# Sections: Agent-Native Architecture (Layer 1)

The 4 categories of agent-native architecture (Layer 1) audit rules. Each rule file uses one category prefix.

---

## 1. Parity (parity)

**Default tier:** mostly release-blocker
**Why critical:** If the agent can't do what the user can do, it's a second-class citizen. Gaps surface as "why can't the agent do X?" with no workaround. Missing CRUD operations strand agents mid-workflow. Parity also runs outward: a tool that answers failure with a sentence gives the caller above it nothing to act on, so the caller guesses.

## 2. Granularity (granularity)

**Default tier:** mostly fix-this-sprint
**Why critical:** Tools that bundle decision logic force the agent to accept or reject a whole workflow; atomic primitives let it apply judgment at each step. If behavior changes need code refactoring instead of prompt edits, granularity is too low. The axis is judgment, not step count: a tool that chains mechanical steps into one user action is fine, and fewer of those beats many thin wrappers.

## 3. Context (context)

**Default tier:** mostly fix-this-sprint
**Why critical:** An agent that doesn't know what exists or what the user has done asks redundant questions, misses relevant data, and feels unintelligent. Context starvation is the most common reason an agent underperforms despite capable tools.

## 4. Communication (comm)

**Default tier:** release-blocker across all three (completion, progress, approval gates)
**Why critical:** Silent agents feel broken. Heuristic completion detection creates race conditions. Missing progress indicators make users kill and restart tasks. An orchestrator with no gate on its execution path auto-executes whatever destructive tool is registered next, which is why the approval-gate rule blocks a release here rather than waiting a sprint.

---

## Rule index

```
parity-no-tool-parity             parity-crud-incomplete            parity-orphan-ui-action
parity-unstructured-tool-output
granularity-workflow-shaped-tool   granularity-static-api-mapping
context-starvation                 context-no-injection              context-no-checkpoint-resume
comm-no-completion-signal          comm-no-progress-visibility       comm-no-approval-gate
```

Total: 12 rules.

---

## Cross-rule interactions

Within this layer, these pairs sit close enough to double-report. Pick one:

- **no-tool-parity + orphan-ui-action**: same defect, different scope. `parity-no-tool-parity` sweeps the shipped codebase; `parity-orphan-ui-action` looks only at the diff. A capability the PR introduced is the orphan finding; anything older is the parity finding, never both.
- **crud-incomplete + no-tool-parity**: `parity-crud-incomplete` is entity-level (this noun is missing an operation), `parity-no-tool-parity` is handler-level (this endpoint has no tool). A missing `update_note` matches both: report the CRUD finding, which names the operation.
- **workflow-shaped-tool + static-api-mapping**: opposite ends of one axis. Too coarse (one tool making domain decisions) versus too many too-thin tools (one per endpoint, no discovery). They should not fire on the same tool; if they do, re-read the tool.
- **context-starvation + context-no-injection**: one static prompt trips both greps. Report `context-starvation` for the missing what-exists block, and `context-no-injection` only when cross-session state is separately absent.
- **no-completion-signal + no-progress-visibility**: both audit the orchestrator's event contract, at the end of the run and during it. A loop that emits nothing fails both; fix the emission once and re-run.
- **unstructured-tool-output + no-completion-signal**: a tool that reports failure as prose with a success status defeats an honest terminal reason downstream. Fix the tool's return shape first; the orchestrator rule is unfixable while its inputs lie.

Across layers, `rules-arch` owns the code path and `rules-ax` owns what the user sees on it:

- **comm-no-approval-gate (arch) + control-no-approval-gate (ax) + control-thin-approval-payload (ax)**: three steps of one chain, not three reports of one defect. The gate exists on the execution path, the treatment matches the stakes, the prompt carries enough to decide. Fix in that order; without a checkpoint there is nowhere to put the ax fixes, and a gate the user cannot read is the last of the three to matter.
- **comm-no-approval-gate (arch) + comm-unrequested-action-no-consent (ax)**: the arch rule audits the gate on the path a user started. Scheduled, webhook, and queue entry points reach the same executor with nobody to prompt, so a gate can pass the arch rule and still leave the unattended path open. File both when both hold, each naming its own entry point.
- **parity-unstructured-tool-output (arch) + trust-no-uncertainty-markers (ax)**: honesty at two altitudes. The tool's result shape versus the agent's hedging in prose. An agent cannot hedge accurately about a tool that reports every outcome as success.
- **comm-no-progress-visibility (arch) + comm-no-progress-signal (ax)**: emission versus presentation. If the server returns one final payload, only the arch rule fires and no component change can resolve it. If events stream and the UI ignores them, only the ax rule fires.
