---
title: <Rule title — short, descriptive>
slug: <category>-<kebab-slug>
category: forms | states | async | focus | mobile | dark-i18n | microcopy
defaultTier: release-blocker | fix-this-sprint | backlog
surfaces: <comma-separated feature playbooks this rule fires in>
react-apis: <comma-separated React 19 / Next.js APIs the fix uses>
related: <comma-separated other rule slugs (modern or laws)>
---

## <Rule title>

One paragraph explaining the failure mode in plain language. Why it hurts users. What modern React patterns introduced or solved it.

## What goes wrong

A concrete, observable scenario. What the user sees, what the code does, why they diverge.

## Detection

**Surfaces:** <which playbooks invoke this — sign-in, checkout, form, etc.>

**Static signals:**
1. Concrete grep / Read step. Use `rg` / `find` / file-extension filters.
2. Each step produces evidence: a file path, a line number, a presence/absence boolean, a count.
3. Last step compares evidence to a threshold.

**Concrete commands:**
```bash
# Inline grep recipes the agent can run.
rg 'isLoading|isPending' --type=tsx src/
```

**False-positive guards:**
- Skip files that already use `<Skeleton>` (or whatever the right escape hatch is).
- Skip files with `// ux-audit-ignore:<this-slug>` near the match.
- Skip files where the component is named `*Story` (Storybook fixtures).

## Fix

**Concrete change** with the modern React API:

```tsx
// before
export function Component() {
  const { data, isLoading } = useQuery(...);
  if (isLoading) return <Spinner />;
  return <Display data={data} />;
}

// after
export function Component() {
  return (
    <Suspense fallback={<DisplaySkeleton />}>
      <DisplayContent />
    </Suspense>
  );
}
```

Link to canonical docs:
- React: https://react.dev/reference/react/<api>
- Next.js: https://nextjs.org/docs/app/api-reference/<api>

## Default tier and overrides

**Defaults to:** `<tier>`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Sign-up | <usually one tier higher> |
| Checkout | <usually one tier higher> |
| Marketing landing | <usually one tier lower> |
| Internal admin | <usually one tier lower> |

## Examples

**Anti-pattern (fails):**

```tsx
// Real-world example showing the bug.
```

**Applied (passes):**

```tsx
// Same component with the modern fix applied.
```

## Defer-to (when this is another tool's job)

If the same finding could come from another tool, link out:
- Lighthouse for runtime measurement
- axe for WCAG rule
- ESLint plugin for write-time prevention

## Suppression

To intentionally ignore this rule on a specific component:

```tsx
{/* ux-audit-ignore:<slug> — reason */}
<Component />
```
