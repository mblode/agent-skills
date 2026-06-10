# Output Format

Defines the output structure for ax-audit results. Two sections: findings table, then AX relationship summary.

## Table of contents

- [Findings table](#findings-table)
- [Field reference](#field-reference)
- [AX relationship summary](#ax-relationship-summary)
- [AX relationship summary, field descriptions](#ax-relationship-summary--field-descriptions)
- [Terminal rendering](#terminal-rendering)

## Findings table

Each finding is a JSON object (schema is deliberately compatible with ux-audit findings so the two reports can be merged):

```json
{
  "rule": "trust-no-confidence-cues",
  "layer": "ax",
  "category": "trust",
  "feature": "agent-chat",
  "surface": "ChatPanel",
  "file": "src/chat/ChatPanel.tsx",
  "line": 42,
  "result": "fail",
  "defaultTier": "fix-this-sprint",
  "assignedTier": "fix-this-sprint",
  "tierReason": "Default tier; agent chat surface.",
  "observed": "Agent output rendered in <AssistantMessage> with no citation, source, or reasoning child components.",
  "evidence": ["src/chat/ChatPanel.tsx:42, <AssistantMessage content={message.content} /> with no children"],
  "fix": "Add a <Sources> or <Reasoning> component inside agent message rendering.",
  "suppressed": false
}
```

## Field reference

| Field | Values / notes |
|---|---|
| `rule` | Rule slug, matches the rule filename without `.md` |
| `layer` | `arch` (Layer 1) or `ax` (Layer 2) |
| `category` | arch: `parity \| granularity \| context \| comm`. ax: `trust \| control \| context \| comm` |
| `feature` | One of the 4 agentic playbooks: `agent-chat`, `agent-tool-execution`, `agent-config`, `agent-dashboard` |
| `surface` | Component or page name the finding sits on (groups the report) |
| `file`, `line` | Evidence location; required on every `fail`/`warn` |
| `result` | `pass \| warn \| fail \| unknown`: `unknown` requires a reason in `observed` |
| `defaultTier`, `assignedTier`, `tierReason` | Tier from the rule file, tier after surface override, and one-sentence justification. The tier is the single ship-impact signal; there is no separate severity field |
| `observed` | What the code actually does, in one sentence |
| `evidence` | Array of `file:line: excerpt` strings backing the finding |
| `fix` | Concrete change; a snippet or one-sentence instruction |
| `suppressed` | `true` when an `ax-audit-ignore:<slug>` comment covers the match, report suppressed counts, never silently drop |

## AX relationship summary

Produced after findings, only when agentic features are detected. Four fields naming the user-agent relationship in behavioral terms.

```json
{
  "axSummary": {
    "evolutionStage": {
      "stage": 2,
      "label": "Task-Aware",
      "behavior": "Agent tracks current task state and adjusts in the moment, but starts fresh each session with no memory of user preferences or history."
    },
    "trustSignal": {
      "level": "moderate",
      "reasoning": "Escape hatches present for all agent actions. Confidence cues missing: agent output has no rationale or source attribution."
    },
    "keyGap": "Agent accumulates no session context; every interaction starts cold. Users re-explain preferences and constraints each time.",
    "trustQuestion": "Will users accept inline rationale (sources, reasoning steps) on every agent response, or will it feel like noise?"
  }
}
```

## AX relationship summary: field descriptions

| Field | Description |
|---|---|
| `evolutionStage` | Which of the 4 stages (see `ax-evolution-curve.md`). Describe the behavior, not the label. The label is for JSON; the behavior is for the reader. |
| `trustSignal` | `high \| moderate \| low` with one-sentence reasoning. Based on how many trust-critical rules passed vs failed (escalation, escape hatch, confidence cues, approval gates). |
| `keyGap` | Single most important architectural or trust gap. One sentence. Specific enough to act on. |
| `trustQuestion` | One question for the designer/developer to answer before the next round. Should be a question only prototyping or research can resolve. |

## Terminal rendering

When rendering to terminal (not JSON), use this format:

```
═══════════════════════════════════════════════════════════
AX VERDICT: ⚠️ READY WITH FOLLOW-UP (0 blockers, 4 fix-this-sprint)

Surfaces:            2 (ChatPanel, ToolExecutionPanel)
Findings:            6
  Release blockers:  0
  Fix this sprint:   4   ⚠️
  Backlog:           2   📋

AX Relationship:
  Stage:       Task-Aware (2 of 4)
  Trust:       Moderate: escape hatches present, confidence cues missing
  Key gap:     No session context; every interaction starts cold
  Question:    Will users accept inline rationale on every response?

Cross-reference:     Run ux-audit for traditional UX findings
═══════════════════════════════════════════════════════════
```
