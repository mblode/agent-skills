---
name: performance-optimization
description: Measurement-driven performance optimization for web applications. Covers Core Web Vitals, React rendering, bundle size, database queries, caching, and image optimization with concrete budgets and profiling workflows. Use when optimizing performance, reducing bundle size, fixing slow pages, profiling React renders, investigating N+1 queries, or asking "why is this slow", "optimize this", "improve performance", "reduce load time."
---

# Performance Optimization

Measure before optimizing. Performance work without measurement is guessing.

## Workflow

```text
Performance optimization:
- [ ] Step 1: Measure (establish baseline)
- [ ] Step 2: Identify (find the bottleneck)
- [ ] Step 3: Fix (address the specific issue)
- [ ] Step 4: Verify (confirm improvement)
- [ ] Step 5: Guard (prevent regression)
```

### Step 1: Measure

Establish a baseline before changing anything.

- **Synthetic**: Lighthouse, Chrome DevTools Performance panel, WebPageTest
- **Real User Monitoring**: `web-vitals` library, Vercel Analytics, or equivalent
- Record Core Web Vitals, Time to First Byte, bundle sizes, and API response times
- Note the measurement conditions (device, network, data volume)

### Step 2: Identify

Find the actual bottleneck — not the assumed one.

- Profile before guessing. Use the Performance panel, React DevTools Profiler, or database query logs
- Look at the waterfall, not individual metrics in isolation
- The bottleneck is usually I/O (network, database, file system), not CPU

### Step 3: Fix

Address the specific measured bottleneck. Common fixes by category below.

### Step 4: Verify

Re-measure with the same conditions as the baseline.

- Compare against the same device, network, and data volume
- Check that the fix didn't regress other metrics (e.g., fixing LCP but worsening CLS)
- Test with realistic data volumes, not empty states

### Step 5: Guard

Prevent regression with automated checks.

- Add bundle size limits to CI (`@next/bundle-analyzer`, `size-limit`)
- Set Lighthouse CI thresholds for CWV
- Monitor RUM dashboards for regressions after deploy
- Add database query count assertions in integration tests for N+1 prevention

## Performance Budgets

| Metric | Target | Measure with |
|--------|--------|-------------|
| LCP | ≤ 2.5s | Lighthouse, web-vitals |
| INP | ≤ 200ms | web-vitals, Chrome DevTools |
| CLS | ≤ 0.1 | Lighthouse, web-vitals |
| JS bundle (gzipped) | < 200KB | `@next/bundle-analyzer` |
| API response (p95) | < 200ms | Server logs, APM |
| Lighthouse Performance | ≥ 90 | Lighthouse CI |
| TTFB | < 600ms | WebPageTest, web-vitals |

## Common Bottlenecks and Fixes

### Database / API

| Problem | Fix |
|---------|-----|
| N+1 queries | Batch with `dataloader`, use `JOIN`, or `include` in ORM |
| Unbounded data fetching | Add pagination, limit default page size |
| Missing indexes | Add indexes for columns in `WHERE`, `ORDER BY`, `JOIN` |
| Redundant queries | Cache with `unstable_cache` / React `cache()` / Redis |
| Slow API responses | Add response caching headers, use stale-while-revalidate |

### React / Frontend

| Problem | Fix |
|---------|-----|
| Unnecessary re-renders | Move state down, split components, use `React.memo` only after profiling |
| Large component trees re-rendering | Use `children` pattern to isolate state from layout |
| Heavy initial JS | Code-split with `dynamic()` / `lazy()`, defer non-critical scripts |
| Layout shift from async content | Set explicit dimensions, use skeleton with matching size |
| Blocking hydration | Use React Server Components, stream with Suspense boundaries |
| Client-side data fetching waterfalls | Fetch in Server Components, use `prefetch` or parallel `Promise.all` |

### Images / Assets

| Problem | Fix |
|---------|-----|
| Unoptimized images | Use `next/image` with `width`/`height`, serve WebP/AVIF |
| Missing responsive sizes | Add `sizes` attribute matching layout breakpoints |
| Large fonts | Subset fonts, use `font-display: swap`, preload critical fonts |
| Too many requests | Combine small assets, use HTTP/2, inline critical CSS |

### Bundle Size

| Problem | Fix |
|---------|-----|
| Large dependencies | Replace with lighter alternatives (e.g., `date-fns` → `dayjs`, `lodash` → native) |
| Importing entire libraries | Use named imports, check tree-shaking with bundle analyzer |
| Duplicate dependencies | Check `npm ls <package>`, deduplicate in lock file |
| Dev dependencies in production | Verify `import` paths, check bundle analyzer output |

## Anti-Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "It's fast enough on my machine." | Your machine is not your user's machine. Measure on target devices and networks. |
| "We'll optimize later." | Performance debt compounds. A slow page loses users before you get to "later." |
| "React.memo everything." | Memoization without profiling is cargo cult optimization. Profile first, memo only what re-renders expensively. |
| "The framework handles performance." | Frameworks provide tools, not guarantees. You still need to measure and respond. |

## Red Flags

- Optimizing without profiling data
- N+1 query patterns (loop with a query inside)
- List endpoints without pagination
- Images without explicit dimensions
- No production performance monitoring
- `React.memo` / `useMemo` / `useCallback` applied without measured re-render cost
- Bundle size growing without bundle analyzer in CI
- API responses returning full objects when the client needs two fields
