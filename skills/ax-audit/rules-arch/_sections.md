# Sections: Agent-Native Architecture (Layer 1)

This file defines the 4 categories of agent-native architecture audit rules. Each rule file uses one of these category prefixes.

---

## 1. Parity (parity)

**Default tier:** mostly release-blocker
**Why critical:** If the agent can't do what the user can do, the agent is a second-class citizen. Parity gaps surface as "why can't the agent do X?": and there's no workaround. Missing CRUD operations strand agents mid-workflow.

## 2. Granularity (granularity)

**Default tier:** mostly fix-this-sprint
**Why critical:** Tools that bundle decision logic force the agent to accept or reject an entire workflow. Atomic primitives let the agent apply judgment at each step. When behavior changes require code refactoring instead of prompt editing, granularity is too low.

## 3. Context (context)

**Default tier:** mostly fix-this-sprint
**Why critical:** An agent that doesn't know what exists, what the user has done, or what's available will ask redundant questions, miss relevant data, and feel unintelligent. Context starvation is the most common reason an agent underperforms despite having capable tools.

## 4. Communication (comm)

**Default tier:** release-blocker for completion/progress; fix-this-sprint for approval gates
**Why critical:** Silent agents feel broken. Heuristic completion detection creates race conditions. Missing progress indicators make users kill and restart tasks unnecessarily. Approval gates that don't match stakes either block users on trivial actions or auto-execute dangerous ones.

---

## Rule index

```
parity-no-tool-parity             parity-crud-incomplete            parity-orphan-ui-action
granularity-workflow-shaped-tool   granularity-static-api-mapping
context-starvation                 context-no-injection              context-no-checkpoint-resume
comm-no-completion-signal          comm-no-progress-visibility       comm-no-approval-gate
```

Total: 11 rules.
