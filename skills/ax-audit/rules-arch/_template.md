---
title: <Rule title, short, descriptive>
slug: <category>-<kebab-slug>
category: parity | granularity | context | comm
defaultTier: release-blocker | fix-this-sprint | backlog
surfaces: <comma-separated agentic feature playbooks this rule fires in>
agent-native-principle: <which agent-native principle this enforces>
detection: code-auditable | hybrid | observational
related: <comma-separated other rule slugs (arch or ax); cross-layer pairs list each other in both files>
---

## <Rule title>

One paragraph: the architectural failure mode in plain language, why it breaks agents, what principle it violates.

## What goes wrong

A concrete, observable scenario: what the user or agent experiences, what the code does, why they diverge.

## Detection

**Surfaces:** <which playbooks invoke this: agent-chat, agent-tool-execution, agent-config, agent-dashboard>

**Static signals:**
1. Concrete grep / Read step. Use `rg` / `find` / file-extension filters.
2. Each step produces evidence: a file path, a line number, a presence/absence boolean, a count.
3. Last step compares evidence to a threshold.

**Concrete commands:**
```bash
# Inline grep recipes the agent can run. Note: ripgrep has no 'tsx' type: '--type=ts' covers *.ts and *.tsx.
rg 'pattern' --type=ts src/
```

**False-positive guards:**
- Skip files that already have the expected pattern.
- Skip files with `// ax-audit-ignore:<this-slug>` near the match.
- Skip test and Storybook fixtures.

## Fix

**Concrete change** with the architectural pattern:

```tsx
// before: the anti-pattern

// after: the corrected pattern
```

## Default tier and overrides

**Defaults to:** `<tier>`

| Surface | Tier |
|---|---|
| Agent tool execution | <usually one tier higher> |
| Agent chat | <same or one tier lower> |
| Agent config | <same> |
| Agent dashboard | <usually one tier lower> |

Cover every surface listed in `surfaces:`. A missing row hands that surface to the generic bump in `references/ship-readiness.md`, so the table is required even when every row just repeats `defaultTier`: the repetition is what suppresses the bump. When a row does not follow the shape above, say why in one line under the table (shared orchestrator code does not taper by surface; a flexibility ceiling does not rise on tool execution).

## Examples

**Anti-pattern (fails):**

```tsx
// Real-world example showing the bug.
```

**Applied (passes):**

```tsx
// Same component with the fix applied.
```

## Suppression

Ignore this rule on a specific component:

```tsx
{/* ax-audit-ignore:<slug>, reason */}
<Component />
```
