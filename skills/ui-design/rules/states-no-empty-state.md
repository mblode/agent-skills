---
title: Empty state has no call to action
id: states-no-empty-state
category: states
defaultTier: fix-this-sprint
detect: static
related: states-no-error-state
---

## Empty state has no call to action

When a list, table, or feed is empty, "No items" alone is a dead end: the user can't tell whether nothing exists, the filter is too narrow, or they must act to populate it. A good empty state names the situation, explains why, and offers exactly one primary action. Onboarding empty states (first-run inbox, fresh dashboard) are the product's highest-leverage surfaces, and the most commonly skipped.

## What goes wrong

A new user lands on the dashboard. The "Recent invoices" widget reads "No invoices": no button, no link, nothing suggesting they create one. The user assumes the feature is broken and bounces. Or a power user filters their inbox to "starred + label:billing + last 7 days": zero results, same dead-end "No messages" with no "Clear filters" CTA.

## Detection

**Surfaces:** list, feed, inbox, table, dashboard widget, search results, first-run dashboard, onboarding step.

**Static signals:**
1. Find empty branches: `items.length === 0`, `isEmpty`, `data?.length ?? 0 === 0`, `!data?.length`, `data === null && !isLoading`.
2. Inspect the JSX the empty branch returns.
3. Fail if it contains only text: no `<Button>`, `<Link>`, `<a>`, `<button>`, `onClick=` element.
4. Fail if the only "action" is a passive sentence ("Try a different search") with no clickable element.

**Concrete commands:**
```bash
# Empty branches
rg -B 1 -A 6 '\.length === 0|isEmpty|!\w+\.length' --type=ts src/

# Empty branches without an action element
rg -l '\.length === 0|isEmpty' --type=ts src/ | while read f; do
  rg -A 8 '\.length === 0|isEmpty' "$f" | rg -q 'Button|Link|<a |onClick' \
    || echo "$f: empty branch without CTA"
done

# Look for "no .* yet" copy without a sibling button
rg -i 'no .{1,30} yet|nothing here|empty' --type=ts src/
```

**False-positive guards:**
- Skip files with `// ui-audit-ignore:states-no-empty-state`.
- Skip transient empty states during initial type-ahead (picker just opened, nothing typed yet): covered separately.
- Skip nested empty branches inside a parent that already provides a page-level CTA.
- Skip Storybook fixtures.

## Fix

Render a named empty state with one primary action:

```tsx
// before
{items.length === 0 && <p>No invoices</p>}

// after
import { FileText } from "lucide-react";

function EmptyInvoices({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <FileText className="h-10 w-10 text-muted-foreground" />
      <h3 className="text-lg font-medium">No invoices yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Create your first invoice to start tracking payments. It takes about a minute.
      </p>
      <Button onClick={onCreate}>Create invoice</Button>
    </div>
  );
}

{items.length === 0 ? <EmptyInvoices onCreate={openInvoiceForm} /> : <List items={items} />}
```

For zero-result searches:

```tsx
{results.length === 0 && (
  <div className="py-8 text-center">
    <p>No results for "{query}".</p>
    <Button variant="ghost" onClick={clearFilters}>Clear filters</Button>
  </div>
)}
```

Docs:
- shadcn/ui empty patterns: https://ui.shadcn.com/docs/components/base/card
- Next.js Link: https://nextjs.org/docs/app/api-reference/components/link

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| First-run dashboard / onboarding step | release-blocker |
| Critical-path picker (e.g. "select a payment method" with zero) | release-blocker |
| List / Feed / Inbox | fix-this-sprint |
| Search results | fix-this-sprint |
| Internal admin | backlog |
| Power-user filter scenarios | backlog |

## Defer-to (when this is another tool's job)

- Copywriting quality on the empty-state body text: defer to copywriting review (this rule only requires a CTA, not perfect copy).

## Suppression

```tsx
{/* ui-audit-ignore:states-no-empty-state, typeahead initial state, CTA would be noise */}
{!query && <p className="text-muted-foreground">Start typing to search</p>}
```
