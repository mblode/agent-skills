---
title: Show-your-work surface is a raw dump nobody reads
slug: trust-transparency-as-noise
category: trust
defaultTier: backlog
surfaces: agent-chat, agent-dashboard
ax-pattern: Considered transparency
detection: observational
related: comm-no-progress-signal, trust-no-confidence-cues, context-memory-not-visible
---

## Show-your-work surface is a raw dump nobody reads

The agent shows everything: every token, every tool call, every intermediate payload, in order, at full length. The team reads this as transparency and the user reads it as a wall. Nobody scans four hundred lines to find out whether the thing that just happened was the thing they wanted, so the panel gets collapsed on day two and the trust it was built to earn is never collected.

Transparency is the reassuring sense that the work is visible whenever you care to look. That is a summary with the detail one level down, not the detail with no summary.

## What goes wrong

An agent runs a twelve-step research task and streams its whole trace into the panel: raw JSON tool arguments, full result bodies, retries, and the model's own deliberation. The user wants one thing, which sources it used. That fact is in there, on line 260, formatted as an argument to a function they have never heard of. They stop opening the panel. The next time the agent gets something wrong, they have no way to tell where it went wrong, and the trace that would have told them is the thing they learned to ignore.

## Detection

**Surfaces:** agent-chat, agent-dashboard

**Auditability:** observational

This rule cannot fail on grep evidence alone. Static signals narrow the candidates; deciding whether a trace is legible needs the rendered flow. On static evidence only, return `unknown` with the reason, never `fail`.

**Static signals:**
1. Find the trace surfaces: components rendering tool calls, thinking blocks, run logs, event streams.
2. Check whether anything between the raw event and the render summarises, groups, or collapses: a step title, a grouped-by-tool view, a default-collapsed detail panel.
3. Flag surfaces that map raw events straight to rows with no summary layer, and surfaces that stringify payloads into the transcript.

**Concrete commands:**
```bash
# trace surfaces
rg -n -i 'ToolCall|RunLog|EventStream|ThinkingBlock|AgentTrace|steps\.map' --type=ts src/

# raw payloads rendered into the transcript
rg -n 'JSON\.stringify' --type=ts src/ -B 2 -A 2

# a summary layer between event and row
rg -n -i 'summar|describeStep|stepTitle|groupBy|collapsed|defaultOpen' --type=ts src/
```

**Judgment signals:**
- One legible line per step, with the payload behind a disclosure, passes. The test is whether the user can answer "what did it do" without expanding anything.
- An `ephemeralToolCalls` flag or equivalent that hides internal chatter is evidence of a considered layer, not a missing one.
- Volume alone is not the finding. A long trace with step titles passes; a short trace of raw JSON fails.
- If the product is a developer tool whose users want the raw trace, this is a pass. Say so in `observed`.

**False-positive guards:**
- Never fire this together with `comm-no-progress-signal`. They are opposite ends of one axis, over-exposure and under-exposure, and cannot both be true of one surface. If both look like they fire, re-read the surface: the usual cause is a raw dump during the run and nothing at the end of it, which is the progress-signal finding.
- Skip debug and developer-mode panels behind a flag.
- Skip files with `// ax-audit-ignore:trust-transparency-as-noise` near the match.
- Skip test and Storybook fixtures.

## Fix

Add the layer between the event stream and the render. Keep the detail; stop leading with it.

```tsx
// before: every event, full length, in order
{run.events.map((e) => (
  <pre key={e.id}>{JSON.stringify(e, null, 2)}</pre>
))}

// after: one legible line per step, detail one level down
{groupIntoSteps(run.events).map((step) => (
  <StepRow key={step.id} title={describeStep(step)} status={step.status}>
    <Disclosure label="Details">
      <EventDetail events={step.events} />
    </Disclosure>
  </StepRow>
))}
```

## Default tier and overrides

**Defaults to:** `backlog`

| Surface | Tier |
|---|---|
| Agent tool execution | backlog |
| Agent chat | backlog |
| Agent dashboard | backlog |
| Agent config | backlog |

The tier stays flat across surfaces, including tool execution, where most rules bump up. A trace that is hard to read is a trust cost, not a safety one: the user can still stop the agent, and the rules that guarantee they can are separate. Promoting this on the execution surface would put a readability finding next to genuine blockers.

## Examples

**Anti-pattern (fails):**

```tsx
<Panel title="What the agent is doing">
  {events.map((e) => (
    <div key={e.id}>
      {e.type}: {JSON.stringify(e.payload)}
    </div>
  ))}
</Panel>
```

**Applied (passes):**

```tsx
<Panel title="What the agent is doing">
  {steps.map((s) => (
    <StepRow key={s.id} title={s.title} status={s.status} count={s.events.length}>
      <Disclosure label={`${s.events.length} calls`}>
        <EventDetail events={s.events} />
      </Disclosure>
    </StepRow>
  ))}
</Panel>
```

## Suppression

```tsx
{/* ax-audit-ignore:trust-transparency-as-noise, developer tool, the raw trace is the product */}
<RawEventStream events={events} />
```
