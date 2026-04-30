---
title: Empty state with no primary action
slug: microcopy-no-action-on-empty
category: microcopy
defaultTier: fix-this-sprint
surfaces: empty-state, list, dashboard, onboarding, search
react-apis: Server Components, Link, Button
related: states-no-empty-state, microcopy-vague-error, memory-zeigarnik, memory-goal-gradient
---

## Empty state with no primary action

An empty state without a CTA is a dead end. The user opens an inbox, sees "No messages yet", and has no idea what to do next — start a conversation? wait? import? Empty states are the highest-leverage moment to teach the product: they appear at the start of the user's journey on every list, dashboard, and feed. Every empty state should answer "**why is this empty**" and "**what action populates it**" with a real `<Button>` or `<Link>`, not just static text.

## What goes wrong

A first-run user lands on the dashboard. The "Recent invoices" widget says "No invoices." There's no button to create one, no link to a tutorial, no hint that invoices come from sending a customer link. The user assumes the product is broken or empty by design and bounces. The fix — adding a `<Link href="/invoices/new">Create your first invoice</Link>` — is one line and recovers the entire session.

## Detection

**Surfaces:** empty-state, list / feed / inbox, dashboard, onboarding, search (zero results).

**This is a candidate-finding rule.** Regex finds empty-state JSX by language patterns; agent confirms it's an empty state and checks for an actionable element.

**Static signals:**
1. Grep for empty-state language in JSX text.
2. For each match, Read the surrounding JSX block.
3. Check whether the block contains a `<Button>`, `<Link>`, `<a>`, or `onClick`-bearing element.
4. Fail the check if the block has copy but no actionable element.

**Concrete commands:**
```bash
# Empty-state language in JSX text.
rg -n -i '>(no [a-z ]+ yet|nothing here|empty|no results|no items|no data)<' \
  --type=tsx --type=ts src/

# Common empty-state component names worth opening.
rg -l -i 'EmptyState|NoResults|ZeroState|<Empty[A-Z]' --type=tsx src/
```

For each match, open the file and verify the block contains at least one of: `<Button`, `<Link`, `<a `, `onClick=`, `<Form` with submit, or a router-based action.

**False-positive guards:**
- Skip read-only / archival surfaces where no action is possible by design (e.g. a closed-period transaction list). Mark with `// ux-audit-ignore:microcopy-no-action-on-empty — read-only archive`.
- Skip filter-driven empty states where the action is "clear filters" — but verify the clear-filters control is visible and discoverable.
- Skip Storybook stories, tests, MSW.
- Skip files where the empty-state component is wrapped by a parent that injects the CTA via children/render props (Read the parent to confirm).

**Agent-judgment limit:** "Action present" is mostly a structural check (look for actionable elements), but judging whether the action is the **right** action — or whether a read-only state is genuinely actionable — needs the agent to read the playbook context (e.g. an inbox empty state should let you compose; a search zero-result should suggest a broader query).

## Fix

Every empty state has at least one primary action. Use a real interactive element, not styled text. On critical paths (first-run onboarding), make the CTA the page's most prominent element.

```tsx
// before
{items.length === 0 && (
  <div className="empty-state">
    <p>No invoices yet.</p>
  </div>
)}

// after — clear cause + primary action + optional secondary
{items.length === 0 && (
  <div role="region" aria-label="No invoices">
    <h3>You haven't sent an invoice yet</h3>
    <p>Invoices appear here once you send a payment link to a customer.</p>
    <Button asChild>
      <Link href="/invoices/new">Create your first invoice</Link>
    </Button>
    <Link href="/help/invoicing" className="text-sm">How invoicing works →</Link>
  </div>
)}
```

For search zero-results, the action is "broaden the query" — show "Clear filters" / "Reset search" buttons inline with the empty message.

Reference:
- NN/g — Empty States in UX: https://www.nngroup.com/articles/empty-state-interface-design/
- NN/g — Beyond Blank Canvas: First-Time UX: https://www.nngroup.com/articles/empty-state-interface-design/
- React: https://react.dev/reference/react-dom/components/common (interactive elements)

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| First-run onboarding (critical path) | release-blocker |
| Primary dashboard widget | fix-this-sprint |
| Secondary list / feed | fix-this-sprint |
| Filter-narrowed empty (filters visible) | backlog |
| Internal admin / read-only archive | backlog |

## Examples

**Anti-pattern (fails):**

```tsx
// 1. Pure text dead end
<div>No projects yet.</div>

// 2. Friendly but no action
<EmptyState title="Inbox zero" description="Nothing here." />

// 3. Search results vanished, no recovery
{results.length === 0 && <p>No matches.</p>}
```

**Applied (passes):**

```tsx
// 1. Cause + primary action
<EmptyState
  title="No projects yet"
  description="Projects organize your tasks and team."
  action={<Button asChild><Link href="/projects/new">Create a project</Link></Button>}
/>

// 2. Inbox with compose CTA
<div>
  <h3>Your inbox is empty</h3>
  <Button onClick={openCompose}>Start a conversation</Button>
</div>

// 3. Search with recovery
{results.length === 0 && (
  <div>
    <p>No matches for "{query}".</p>
    <Button onClick={() => setQuery('')}>Reset search</Button>
  </div>
)}
```

## Defer-to (when this is another tool's job)

- **WCAG: empty regions need accessible names** — axe.
- **Visual polish of empty illustrations** — design review.
- **Goal-gradient / Zeigarnik framing on onboarding empties** — Layer 3 (`memory-goal-gradient`, `memory-zeigarnik`).

## Suppression

```tsx
{/* ux-audit-ignore:microcopy-no-action-on-empty — read-only archive of closed periods */}
<EmptyState title="No closed invoices in this period" />
```
