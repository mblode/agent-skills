---
title: <Rule title, short, descriptive>
slug: <category>-<kebab-slug>
category: trust | control | context | comm
defaultTier: release-blocker | fix-this-sprint | backlog
surfaces: <comma-separated agentic feature playbooks this rule fires in>
ax-pattern: <which AX pattern or anti-pattern this enforces>
detection: code-auditable | hybrid | observational
related: <comma-separated other rule slugs (arch or ax)>
---

## <Rule title>

One paragraph explaining the trust or interaction failure mode in plain language. Why it erodes user trust. What AX pattern it violates.

## What goes wrong

A concrete, observable scenario. What the user experiences, what the agent does, why trust breaks.

## Detection

**Surfaces:** <which playbooks invoke this: agent-chat, agent-tool-execution, agent-config, agent-dashboard>

**Auditability:** <code-auditable | hybrid | observational>

**Static signals** (for code-auditable and hybrid rules):
1. Concrete grep / Read step. Use `rg` / `find` / file-extension filters.
2. Each step produces evidence: a file path, a line number, a presence/absence boolean, a count.
3. Last step compares evidence to a threshold.

**Concrete commands:**
```bash
# Inline grep recipes the agent can run. Note: ripgrep has no 'tsx' type: '--type=ts' covers *.ts and *.tsx.
rg 'pattern' --type=ts src/
```

**Judgment signals** (for hybrid and observational rules):
- What to look for in the component tree or interaction flow.
- What qualifies as present vs. missing vs. misapplied.

**False-positive guards:**
- Skip files that already have the expected pattern.
- Skip files with `// ax-audit-ignore:<this-slug>` near the match.
- Skip test and Storybook fixtures.

## Fix

**Concrete change:**

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
// Real-world example showing the trust failure.
```

**Applied (passes):**

```tsx
// Same component with trust pattern applied.
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
