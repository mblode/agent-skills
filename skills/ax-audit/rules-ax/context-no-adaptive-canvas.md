---
title: Interface static during agent task progression
slug: context-no-adaptive-canvas
category: context
defaultTier: backlog
surfaces: agent-tool-execution, agent-dashboard, agent-config
ax-pattern: Adaptive Canvas
detection: code-auditable
related: context-memory-not-visible, comm-no-progress-signal
---

## Interface static during agent task progression

Agent moves through phases (researching, drafting, reviewing, complete) but the UI looks identical in every phase. No phase indicator, no layout change, no context-appropriate tools surfaced. Adaptive Canvas requires the interface to reshape itself around the agent's current activity.

## What goes wrong

Agent starts a research task. User sees "Searching..." then nothing changes for 45 seconds. The agent transitions through phases but the layout never shifts. No stepper, no phase-specific controls. User doesn't know where the agent is or how close to done.

## Detection

**Surfaces:** agent-tool-execution, agent-dashboard, agent-config

**Auditability:** code-auditable

**Static signals:**
1. Find agent workflow state: phase, status, or stage enums/state machines.
2. Check whether rendering differs across phases (conditional rendering, different components per phase).
3. Flag workflows where UI is identical regardless of agent phase.

**Concrete commands:**
```bash
rg '(phase|stage|status|workflow).*(enum|type|const)' --type=ts src/
rg '(stateMachine|createMachine|useReducer|switch.*phase)' --type=ts src/
rg '(Stepper|ProgressBar|PhaseIndicator|StageIndicator)' --type=ts -l src/
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:context-no-adaptive-canvas`.
- Skip test and Storybook fixtures.
- Skip single-step agent interactions where no multi-phase workflow exists.

## Fix

Show a phase indicator (stepper, progress bar). Surface phase-appropriate tools (research tools during research, editing tools during review). Reshape the layout to match the current activity.

## Default tier and overrides

**Defaults to:** `backlog`

| Surface | Tier |
|---|---|
| Agent tool execution | fix-this-sprint |
| Agent dashboard | backlog |
| Agent config | backlog |

## Examples

**Anti-pattern (fails):**

```tsx
function ResearchAgent({ status }: { status: string }) {
  // status is "searching" | "analyzing" | "complete": UI never changes
  return <div className="flex"><ChatPanel /><Sidebar /></div>;
}
```

**Applied (passes):**

```tsx
function ResearchAgent({ status, data }: { status: AgentStatus; data: AgentData }) {
  return (
    <div>
      <Stepper steps={["Searching", "Analyzing", "Complete"]} current={status} />
      {status === "searching" && <SearchProgress queries={data.queries} />}
      {status === "analyzing" && <AnalysisView sources={data.sources} />}
      {status === "complete" && <ResultsView results={data.results} />}
    </div>
  );
}
```

## Suppression

```tsx
{/* ax-audit-ignore:context-no-adaptive-canvas, single-turn chat, no multi-phase workflow */}
<AgentChat />
```
