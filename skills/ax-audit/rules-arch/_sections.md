# Sections: Agent-Native Architecture (Layer 1)

The 4 categories of agent-native architecture (Layer 1) audit rules. Each rule file uses one category prefix.

---

## 1. Parity (parity)

**Default tier:** mostly release-blocker
**Why critical:** If the agent can't do what the user can do, it's a second-class citizen. Gaps surface as "why can't the agent do X?" with no workaround. Missing CRUD operations strand agents mid-workflow.

## 2. Granularity (granularity)

**Default tier:** mostly fix-this-sprint
**Why critical:** Tools that bundle decision logic force the agent to accept or reject a whole workflow; atomic primitives let it apply judgment at each step. If behavior changes need code refactoring instead of prompt edits, granularity is too low.

## 3. Context (context)

**Default tier:** mostly fix-this-sprint
**Why critical:** An agent that doesn't know what exists or what the user has done asks redundant questions, misses relevant data, and feels unintelligent. Context starvation is the most common reason an agent underperforms despite capable tools.

## 4. Communication (comm)

**Default tier:** release-blocker for completion/progress; fix-this-sprint for approval gates
**Why critical:** Silent agents feel broken. Heuristic completion detection creates race conditions. Missing progress indicators make users kill and restart tasks. Approval gates that don't match stakes either block trivial actions or auto-execute dangerous ones.

---

## Rule index

```
parity-no-tool-parity             parity-crud-incomplete            parity-orphan-ui-action
granularity-workflow-shaped-tool   granularity-static-api-mapping
context-starvation                 context-no-injection              context-no-checkpoint-resume
comm-no-completion-signal          comm-no-progress-visibility       comm-no-approval-gate
```

Total: 11 rules.
