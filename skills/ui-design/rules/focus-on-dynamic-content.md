---
title: No focus management on dynamic content (route change, async load, error)
id: focus-on-dynamic-content
category: focus
defaultTier: fix-this-sprint
detect: static
related: focus-not-restored, a11y-skip-link-heading-order, states-no-error-state
---

## No focus management on dynamic content (route change, async load, error)

SPAs don't reload on navigation, so the browser never moves focus or announces new content to screen readers. Same for async-loaded sections, validation errors, and result-list updates: without manual focus management or `aria-live`, SR users never know the content changed. Two-pronged fix: focus the new heading on route/section change, and use `aria-live="polite"` (or `assertive` for errors) for updates that don't shift focus.

## What goes wrong

Search submitted, results render. Sighted users see the list; SR users hear nothing because focus stays on the input, the results have no live region, and nothing was focused. They don't know the search worked. Or: route goes `/dashboard` to `/dashboard/billing`: visually new, but for assistive tech focus is still wherever the click happened.

## Detection

**Surfaces:** search results, route transitions, async-loaded content, validation error summaries, in-page error/success banners.

**Static signals:**
1. `rg 'router\.(push|replace)|useRouter\(\)' --type=ts -l`: programmatic nav callers.
2. `rg 'isLoading|isPending' --type=ts -l`: components that swap async content.
3. For each, look for one of:
   - `useEffect` + `ref.current?.focus()` after content mounts.
   - `aria-live="polite"` or `role="status"` on the dynamic region.
   - `aria-live="assertive"` or `role="alert"` on error regions.
4. Flag dynamic regions with neither focus management nor a live region.

**Concrete commands:**
```bash
# Route changes without focus management
rg -l 'router\.(push|replace)' --type=ts src/ app/ | while read f; do
  rg -A 5 'router\.(push|replace)' "$f" | rg -q 'focus\(\)|aria-live' \
    || echo "$f: route change without focus or live-region handling"
done

# Async content updates without aria-live or focus
rg -l 'isLoading\s*\?\s*' --type=ts src/ app/ | while read f; do
  rg -B 2 -A 6 'isLoading\s*\?\s*' "$f" | rg -q 'aria-live|role="status"|role="alert"|\.focus\(' \
    || echo "$f: async update without focus or live-region handling"
done

# Error banners without role="alert"
rg -l 'errors?\.length|hasError|state\.error' --type=ts src/ app/ | while read f; do
  rg -B 2 -A 4 'errors?\.length|hasError|state\.error' "$f" | rg -q 'role="alert"|aria-live="assertive"' \
    || echo "$f: error banner without alert semantics"
done
```

**False-positive guards:**
- Skip if a known live-region wrapper (e.g. `<Toaster />` from sonner) covers the content.
- Skip new App Router segments (Next.js focuses the route on hard navigation; SPA nav still needs help).
- Skip files annotated `// ui-audit-ignore:focus-on-dynamic-content`.

## Fix

Pick one (or both) per dynamic region.

**A. Focus the new heading on route or section mount:**

```tsx
'use client';
import { useEffect, useRef } from 'react';

export default function BillingPage() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  return (
    <main>
      <h1 ref={headingRef} tabIndex={-1}>
        Billing
      </h1>
      ...
    </main>
  );
}
```

**B. `aria-live` for inline updates that don't move focus** (search results, count badges, "saved" hints):

```tsx
<div role="status" aria-live="polite" className="sr-only">
  {results.length === 0
    ? `No results for "${q}"`
    : `${results.length} results`}
</div>
<Results items={results} />
```

**C. `aria-live="assertive"` (or `role="alert"`) for errors:**

```tsx
{error && (
  <div role="alert" className="error">
    {error.message}
  </div>
)}
```

Docs:
- React refs: https://react.dev/reference/react/useRef
- ARIA live regions: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
- WCAG 4.1.3 Status Messages: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Search results | release-blocker (core feature broken for SR users) |
| Critical-path errors (sign-in, checkout) | release-blocker |
| Onboarding step transitions | fix-this-sprint |
| Marketing landing | backlog |
| Internal admin | backlog |

## Defer-to (when this is another tool's job)

- axe-core: WCAG 4.1.3 (Status Messages) checks.
- Manual screen-reader pass: automated tools can't verify announcements were heard.
- Vercel Agent / CodeRabbit: diff-time spotting.

## Suppression

```tsx
{/* ui-audit-ignore:focus-on-dynamic-content, content change is purely decorative */}
```
