---
title: Agent presents everything with equal certainty
slug: trust-no-uncertainty-markers
category: trust
defaultTier: fix-this-sprint
surfaces: agent-chat, agent-dashboard
ax-pattern: Confidence Cues
detection: observational
related: trust-no-confidence-cues, trust-no-escalation-path
---

## Agent presents everything with equal certainty

Agent is 95% sure about one recommendation and 40% sure about another, but both render identically. When the 40% answer is wrong, user doesn't just distrust that answer. They distrust everything. Confident wrong answers cause permanent trust damage.

## What goes wrong

Two recommendations in the same response: one well-supported, one a guess. Same font, same weight, same formatting. User treats both as equally reliable. The guess is wrong. User now second-guesses every future response. Trust is binary when the interface gives no gradient.

## Detection

**Surfaces:** agent-chat, agent-dashboard

**Auditability:** observational

**Static signals:**
1. Find agent output containers.
2. Check for confidence props (`confidence`, `certainty`, `score`) or uncertainty components.
3. Absence of all = flag.

**Concrete commands:**
```bash
rg 'confidence|certainty|ConfidenceBadge|UncertaintyIndicator' --type=ts src/
```

**Judgment signals:**
- Hedging in prompt instructions is weaker than structured indicators but better than nothing.
- A badge always showing "high" is not meaningful: check for actual variation.

**False-positive guards:**
- Skip `// ax-audit-ignore:trust-no-uncertainty-markers`, test, and Storybook files.
- Skip trivial outputs (confirmations, acknowledgments) where confidence is always 100%.

## Fix

Add confidence indicators: numeric score, visual badge (high/medium/low), hedging language, or expandable reasoning that shows uncertainty.

## Examples

**Anti-pattern (fails):**

```tsx
<ul>
  {recommendations.map((rec) => (
    <li key={rec.id}>{rec.text}</li>
  ))}
</ul>
```

**Applied (passes):**

```tsx
<ul>
  {recommendations.map((rec) => (
    <li key={rec.id}>
      {rec.text}
      <ConfidenceBadge level={rec.confidence > 0.8 ? "high" : "low"} />
    </li>
  ))}
</ul>
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | fix-this-sprint |
| Agent config | backlog |
| Agent dashboard | fix-this-sprint |

## Suppression

```tsx
{/* ax-audit-ignore:trust-no-uncertainty-markers, deterministic lookups, no uncertainty */}
<AgentRecommendation text={result.text} />
```
