---
title: <Rule title, short, descriptive>
slug: <category>-<kebab-slug>
category: forms | states | async | focus | mobile | dark-i18n | microcopy
defaultTier: release-blocker | fix-this-sprint | backlog
surfaces: <comma-separated feature playbooks this rule fires in>
react-apis: <comma-separated React 19 / Next.js APIs the fix uses>
related: <comma-separated other rule slugs (modern or laws)>
---

## <Rule title>

One paragraph: the failure mode in plain language, why it hurts users, what modern React patterns introduced or solved it.

## What goes wrong

A concrete, observable scenario: what the user sees, what the code does, why they diverge.

## Detection

**Surfaces:** <which playbooks invoke this: sign-in, checkout, form, etc.>

**Static signals:**
1. Concrete grep/Read step (`rg`, `find`, file-extension filters).
2. Each step yields evidence (file path, line number, presence/absence boolean, count); the last step compares evidence to a threshold.

**Concrete commands:**
```bash
# Inline grep recipes the agent can run.
rg 'isLoading|isPending' --type=ts src/
```

**False-positive guards:**
- Skip files that already use `<Skeleton>` (or whatever the right escape hatch is).
- Skip files with `// ui-audit-ignore:<this-slug>` near the match.
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

Link canonical docs: React https://react.dev/reference/react/<api>, Next.js https://nextjs.org/docs/app/api-reference/<api>.

One before/after pair per rule, here. Add an extra `## Examples` section only for a bank of genuinely different scenarios that the Fix cannot carry (the `microcopy-*` rules do this, because the defect is the string itself). Never restate the Fix in a second pair, and don't add a `## Contents` index: these headings are the whole file shape.

## Default tier and overrides

**Defaults to:** `<tier>`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Sign-up | <usually one tier higher> |
| Checkout | <usually one tier higher> |
| Marketing landing | <usually one tier lower> |
| Internal admin | <usually one tier lower> |

## Defer-to (when this is another tool's job)

If another tool owns the finding, link out: Lighthouse (runtime measurement), axe (WCAG rule), ESLint plugin (write-time prevention).

## Examples

Optional, and only where wording is the deliverable: a `microcopy-*` rule needs the actual bad and good strings shown, because a prose description of a string is not the string. Everywhere else the `## Fix` before/after already carries it, so a second pair here is redundant.

## Suppression

To ignore this rule on a specific component:

```tsx
{/* ui-audit-ignore:<slug>, reason */}
<Component />
```
