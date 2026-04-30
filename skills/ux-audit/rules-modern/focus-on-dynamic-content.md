---
title: No focus management on dynamic content (route change, async load, error)
slug: focus-on-dynamic-content
category: focus
defaultTier: fix-this-sprint
surfaces: search, list, error-state, onboarding, dashboard, modal
react-apis: useEffect + ref.current.focus(), aria-live, role="status", role="alert"
related: focus-not-restored, focus-no-skip-link, states-no-error-state
---

## No focus management on dynamic content (route change, async load, error)

Single-page apps don't reload the page on navigation, which means the browser doesn't move focus or announce the new content to screen readers. The same is true for async-loaded sections, validation errors, and result-list updates. Without manual focus management or `aria-live` regions, screen-reader users have no idea the content changed. The fix is two-pronged: focus the new heading on route/section change, and use `aria-live="polite"` (or `assertive` for errors) for content updates that don't shift focus.

## What goes wrong

User submits a search. Results render. Sighted users see the list. Screen-reader users hear nothing — focus is still on the search input, the results section has no live region, and no element was focused. They don't know the search succeeded. Or: route changes from `/dashboard` to `/dashboard/billing`. Visually the page is new; for assistive tech, focus is still wherever the click happened.

## Detection

**Surfaces:** search results, route transitions, async-loaded content, validation error summaries, in-page error/success banners.

**Static signals:**
1. `rg 'router\.(push|replace)|useRouter\(\)' --type=tsx -l` — programmatic nav callers.
2. `rg 'isLoading|isPending' --type=tsx -l` — components that swap async content.
3. For each, look for one of:
   - `useEffect` + `ref.current?.focus()` after content mounts.
   - `aria-live="polite"` or `role="status"` on the dynamic region.
   - `aria-live="assertive"` or `role="alert"` on error regions.
4. Flag dynamic regions with neither focus management nor a live region.

**Concrete commands:**
```bash
# Route changes without focus management
rg -A 5 'router\.(push|replace)' --type=tsx | rg -L 'focus\(\)|aria-live'

# Async content updates without aria-live or focus
rg -B 2 -A 6 'isLoading\s*\?\s*' --type=tsx | rg -L 'aria-live|role="status"|role="alert"|\.focus\('

# Error banners without role="alert"
rg -B 2 -A 4 'errors?\.length|hasError|state\.error' --type=tsx | rg -L 'role="alert"|aria-live="assertive"'
```

**False-positive guards:**
- Skip if a known live-region wrapper (e.g. `<Toaster />` from sonner) covers the content.
- Skip if the change navigates to a new App Router segment (Next.js does focus the route on hard navigation, though SPA nav still needs help).
- Skip files annotated `// ux-audit-ignore:focus-on-dynamic-content`.

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
- ARIA live regions: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
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

## Examples

**Anti-pattern (fails):**
```tsx
function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  // results render visually but no announcement, no focus move
  return (
    <>
      <input value={q} onChange={(e) => setQ(e.target.value)} />
      <Results items={results} />
    </>
  );
}
```

**Applied (passes):**
```tsx
function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  return (
    <>
      <input value={q} onChange={(e) => setQ(e.target.value)} />
      <div role="status" aria-live="polite" className="sr-only">
        {results.length} results for &ldquo;{q}&rdquo;
      </div>
      <Results items={results} />
    </>
  );
}
```

## Defer-to (when this is another tool's job)

- axe-core: WCAG 4.1.3 (Status Messages) checks.
- Manual screen-reader pass — automated tools cannot fully verify announcements were heard.
- Vercel Agent / CodeRabbit for diff-time spotting.

## Suppression

```tsx
{/* ux-audit-ignore:focus-on-dynamic-content — content change is purely decorative */}
```
