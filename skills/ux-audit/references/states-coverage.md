# States Coverage

The single highest-leverage check: every component that fetches data, takes input, or controls a transient process has a complete set of states. The most common production UX bug is a component built for the happy path with no `loading`, `empty`, or `error` branch.

## Table of contents

- [Canonical state matrix per component type](#canonical-state-matrix-per-component-type)
- [Mandatory state pairings](#mandatory-state-pairings)
- [Detection recipes](#detection-recipes)
- [State-pair pitfalls (the bugs)](#state-pair-pitfalls-the-bugs)

## Canonical state matrix per component type

For each component type, these states must exist (or be explicitly N/A with a comment).

### Async data fetcher (list, dashboard widget, search)

| State | What user sees | Pass | Fail |
|---|---|---|---|
| `loading` | Skeleton matching loaded layout (CLS-safe) | `<Skeleton h="N">` with `min-height` ≥ loaded height | Centered spinner without `min-height` |
| `empty` | Helpful guidance + primary CTA | "No invoices yet" + `<Button>Create invoice</Button>` | "No items" with no CTA |
| `error` | Cause + retry path + preserved input (if any) | "Couldn't load — Try again" with retry handler | Generic toast that disappears |
| `success` | Loaded data | Default render | — |
| `partial` (paginated/infinite) | Loaded prefix + spinner for next | Skeleton row at bottom for pending page | Layout jump on next-page load |

### Form

| State | What user sees | Pass | Fail |
|---|---|---|---|
| `idle` | Default form, fields empty or autofilled | — | — |
| `pending` | Submit disabled + visible pending indicator | `useFormStatus().pending` drives `disabled` + label change | No disable; double-submit possible |
| `error` | Field-level errors + values preserved | `useActionState` `state.errors` + `state.fields` | Form clears on error |
| `success` | Confirmation; route forward or reset | Named completion screen | Generic toast then redirect |

### Modal / Dialog

| State | What user sees | Pass | Fail |
|---|---|---|---|
| `closed` | Trigger button | — | — |
| `opening` | Animation, focus moves to first focusable | `autoFocus` or `initialFocus` set | Focus on `<body>` |
| `open` | Modal content; Esc + backdrop close | `onEscapeKeyDown` + `onPointerDownOutside` handled | Cannot dismiss without confirm-button |
| `closing` | Animation, focus returns to trigger | `onCloseAutoFocus` set OR `triggerRef.focus()` in `onClose` | Focus to `<body>` (lost) |
| `unmounted` | Trigger button regains focus | Same as closed | — |

### Button / Trigger

| State | What user sees | Pass | Fail |
|---|---|---|---|
| `idle` | Default visual | — | — |
| `hover` | Hover affordance | Visible state change AND `:focus-visible` parity | Hover-only (no focus parity) |
| `focus` | Focus ring visible to keyboard users | `:focus-visible` ring | `:focus { outline: none }` without alternative |
| `active` | Pressed state | Visible compression / color shift | None |
| `pending` | Disabled + label change | `<Spinner>` + label="Saving..." | Same look as idle |
| `disabled` | Grayed out + cursor `not-allowed` + tooltip explanation | `aria-disabled` + tooltip with reason | `pointer-events: none` only |

### Input

| State | What user sees | Pass | Fail |
|---|---|---|---|
| `empty` | Placeholder OR floating label | — | Placeholder used as label |
| `typed` | Value visible | — | — |
| `focus` | Visible focus ring | `:focus-visible` | None |
| `invalid` | Field-level error message | Inline error below; `aria-invalid="true"`; `aria-describedby` | Toast only; no `aria-invalid` |
| `disabled` | Grayed out + reason | `disabled` attribute + tooltip | `readonly` (wrong semantic) |
| `valid` | Optional success affordance | Subtle check icon | None |

### List / Feed / Table

| State | What user sees | Pass | Fail |
|---|---|---|---|
| `loading` | N skeleton rows matching item layout | `Array.from({length: 5}, …)` of `<RowSkeleton>` | Spinner centered above empty area |
| `empty` | Helpful empty + create CTA | "No invoices yet — Create one" | "No items" |
| `error` | Cause + retry | "Couldn't load — Try again" | Generic toast |
| `partial` (pagination/infinite) | Loaded prefix + spinner row | `<RowSkeleton />` at end | Page jumps when next loads |
| `populated` | Items rendered | — | — |

### Toast / Notification

| State | What user sees | Pass | Fail |
|---|---|---|---|
| `entering` | Slide/fade in | `animate-*` enter | Pop without animation |
| `visible` | Read time minimum | ≥ 5 s for ≥ 1 sentence; ≥ 8 s with action | 3 s default; user can't read |
| `actionable` (if has button) | Button focusable; toast persists until acted | `aria-live="assertive"` for urgent; `polite` for info | No `aria-live`; SR users miss it |
| `dismissed` | Slide/fade out | Animated exit | Disappears |

## Mandatory state pairings

These pairs always go together. Detecting one without the other is a bug:

| Pair | Why | Bug if violated |
|---|---|---|
| `loading` ↔ skeleton with `min-height` | CLS-safe | Layout shifts when data arrives (Lighthouse CLS) |
| `empty` ↔ primary CTA | Empty without next-step is a dead-end | User stalls |
| `error` ↔ retry path | Errors without recovery are dead-ends | User leaves |
| `error` ↔ preserved input | Re-entering data is hostile | User abandons |
| `disabled` ↔ explanation | Mystery disabled buttons confuse | User can't unblock self |
| `pending` ↔ disabled submit | Otherwise double-submit | Duplicate records |
| `optimistic` ↔ rollback | Otherwise inconsistent state | UI lies after server reject |
| `destructive` ↔ confirm | Mistakes are unrecoverable | Data loss |
| `color-state` ↔ icon/text | Color blindness | 8% of users miss the signal |
| `toast` ↔ `aria-live` | SR users miss async alerts | a11y bug |
| `dialog open` ↔ focus moves in | Keyboard users lose context | Tab key escapes modal |
| `dialog close` ↔ focus restored | Keyboard users lose place | Tab from `<body>` |

## Detection recipes

Static-analysis patterns the audit can run:

```bash
# Loading without skeleton
rg 'isLoading|isPending|loading\?' --type=tsx src/ -l | while read f; do
  rg -L 'Skeleton|aria-busy' "$f" && echo "$f: loading without skeleton"
done

# Empty without CTA
rg '\.length === 0|isEmpty|items\.length' --type=tsx src/ -l | while read f; do
  rg -L 'Button|Link|<a |action' "$f" && echo "$f: empty branch without CTA"
done

# Error branch without retry
rg 'catch|onError|isError|hasError|error[?:]' --type=tsx src/ -l | while read f; do
  rg -L 'retry|tryAgain|refetch' "$f" && echo "$f: error without retry"
done

# Form without useFormStatus child or pending state
rg '<form' --type=tsx src/ -l | while read f; do
  rg -L 'useFormStatus|isPending|isSubmitting|pending' "$f" && echo "$f: form without pending state"
done

# Dialog without onCloseAutoFocus / focus restoration
rg 'role="dialog"|<Dialog' --type=tsx src/ -l | while read f; do
  rg -L 'onCloseAutoFocus|triggerRef|finalFocus' "$f" && echo "$f: dialog without focus restoration"
done

# Optimistic without rollback
rg 'useOptimistic' --type=tsx src/ -l | while read f; do
  rg -L 'catch|rollback|revert|onError' "$f" && echo "$f: optimistic without rollback"
done
```

These recipes are starting points; rules in `rules-modern/` have refined detection per rule.

## State-pair pitfalls (the bugs)

Top patterns that ship to production:

1. **Spinner with no min-height.** Renders at 0×0, then layout jumps to full content. CLS regression even if loading state exists.
2. **Empty state shows "No items"** with no CTA. User stalls.
3. **Error state shows "Something went wrong"** with no actionable detail. User reloads or leaves.
4. **Submit button has no `pending` state.** User clicks twice; backend gets duplicate request.
5. **Modal doesn't restore focus.** Keyboard user tabs from `<body>` next; loses context.
6. **Optimistic update doesn't roll back.** Server returns 422; UI keeps the optimistic value; eventual reload reveals truth.
7. **Loading skeleton has different height than loaded content.** Layout jumps on data arrival (CLS).
8. **Disabled button has no `aria-disabled` or tooltip.** User can't tell why it's disabled.
9. **Toast disappears in 3 s.** Screen-reader users and slow readers miss it.
10. **Color-only validation.** Red border without icon or `aria-invalid` — 8% of users miss it.
