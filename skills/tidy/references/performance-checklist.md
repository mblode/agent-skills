# Performance Checklist

Bottlenecks a diff shows on its face. Load when the diff touches data fetching, rendering, images, dependencies, or bundle-affecting imports. Budgets and measured vitals are not a review verdict: lab attribution belongs to `ui-verification`, budgets to Lighthouse and field data.

## Contents

- Database and API bottlenecks
- Frontend bottlenecks
- Image and asset bottlenecks
- Bundle size bottlenecks

## Database and API

| Problem | What to flag |
|---------|-------------|
| N+1 queries | Loop containing a query. Batch with `dataloader`, `JOIN`, or ORM `include` |
| Unbounded data fetching | Missing pagination or limit on list endpoints |
| Missing indexes | `WHERE`, `ORDER BY`, or `JOIN` on unindexed columns |
| Redundant queries | Same data fetched multiple times. Use `cache()`, Redis, or `unstable_cache` |
| No response caching | Missing `Cache-Control` or `stale-while-revalidate` headers on stable data |
| Blocking the event loop | `readFileSync`, `execSync`, sync crypto or compression inside a request handler or middleware. Use the async API, or do the work once at boot |

## Frontend

| Problem | What to flag |
|---------|-------------|
| Heavy initial JS | Large page components not code-split. Use `dynamic()` or `lazy()` |
| Layout shift from async content | Missing explicit dimensions on async-loaded elements |
| Blocking hydration | Client-heavy components blocking server render. Use RSC or Suspense boundaries |
| Waterfall data fetching | Sequential client-side fetches. Move to Server Components or `Promise.all` |

## Images and Assets

| Problem | What to flag |
|---------|-------------|
| Unoptimized images | Not using `next/image`, missing `width`/`height`, not serving WebP/AVIF |
| Missing responsive sizes | No `sizes` attribute matching layout breakpoints |
| Large fonts | Not subset, missing `font-display: swap`, not preloading critical fonts |

## Bundle Size

| Problem | What to flag |
|---------|-------------|
| Large dependencies | Heavy libraries with lighter alternatives (`lodash` to native, `moment` to `date-fns`) |
| Importing entire libraries | Barrel imports pulling in unused code. Use named imports, verify tree-shaking |
| Duplicate dependencies | Same package at multiple versions. Check `npm ls`, deduplicate |

## Red Flags

Flag these even without profiling data; they are almost always problems:

- N+1 query pattern (query inside a loop)
- List endpoint without pagination
- Images without explicit dimensions
- `React.memo`/`useMemo`/`useCallback` applied without evidence of re-render cost
- API response returning full objects when the client uses two fields
