---
title: <Rule title, short, descriptive>
slug: <category>-<kebab-slug>
category: parity | granularity | context | comm
defaultTier: release-blocker | fix-this-sprint | backlog
surfaces: <comma-separated agentic feature playbooks this rule fires in>
agent-native-principle: <which agent-native principle this enforces>
detection: code-auditable | hybrid | observational
related: <comma-separated other rule slugs (arch or ax)>
---

## <Rule title>

One paragraph explaining the architectural failure mode in plain language. Why it breaks agents. What principle it violates.

## What goes wrong

A concrete, observable scenario. What the user or agent experiences, what the code does, why they diverge.

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

**Surface overrides:**
| Surface | Tier |
|---|---|
| Agent tool execution | <usually one tier higher> |
| Agent chat | <same or one tier lower> |
| Agent config | <same> |
| Agent dashboard | <usually one tier lower> |

## Examples

**Anti-pattern (fails):**

```tsx
// Real-world example showing the bug.
```

**Applied (passes):**

```tsx
// Same component with the fix applied.
```

## Cross-reference

If a finding overlaps with ux-audit rules, link out:
- `ux-audit` rule `<slug>` for the traditional UX dimension

## Suppression

To intentionally ignore this rule on a specific component:

```tsx
{/* ax-audit-ignore:<slug>, reason */}
<Component />
```
