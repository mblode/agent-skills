# States Coverage

The highest-leverage check: every component that fetches data, takes input, or runs a transient process needs a full set of states. The commonest production UX bug is a happy-path-only component missing `loading`, `empty`, or `error`. Per-rule detection greps live in the `rules/states-*` and `rules/forms-*` files; this reference is the coverage map, not a second copy of those greps.

## Table of contents

- [Canonical state matrix per component type](#canonical-state-matrix-per-component-type)
- [Mandatory state pairings](#mandatory-state-pairings)

## Canonical state matrix per component type

Each component type must implement these states (or mark N/A with a comment). Trimmed to the four types the feature playbooks dispatch on; button/input/toast state details live in the `rules/interaction-*`, `rules/forms-*`, and `rules/nav-*` rules.

### Async data fetcher (list, dashboard widget, search)

| State | What user sees | Pass | Fail |
|---|---|---|---|
| `loading` | Skeleton matching loaded layout (CLS-safe) | `<Skeleton h="N">` with `min-height` ≥ loaded height | Centered spinner without `min-height` |
| `empty` | Helpful guidance + primary CTA | "No invoices yet" + `<Button>Create invoice</Button>` | "No items" with no CTA |
| `error` | Cause + retry path + preserved input (if any) | "Couldn't load: Try again" with retry handler | Generic toast that disappears |
| `success` | Loaded data | Default render | - |
| `partial` (paginated/infinite) | Loaded prefix + spinner for next | Skeleton row at bottom for pending page | Layout jump on next-page load |

### Form

| State | What user sees | Pass | Fail |
|---|---|---|---|
| `idle` | Default form, fields empty or autofilled | - | - |
| `pending` | Submit disabled + visible pending indicator | `useFormStatus().pending` drives `disabled` + `aria-busy`, label stays stable | No disable; double-submit possible |
| `error` | Field-level errors + values preserved | `useActionState` `state.errors` + `state.fields` | Form clears on error |
| `success` | Confirmation; route forward or reset | Named completion screen | Generic toast then redirect |

### Modal / Dialog

| State | What user sees | Pass | Fail |
|---|---|---|---|
| `closed` | Trigger button | - | - |
| `opening` | Animation, focus moves to first focusable | `autoFocus` or `initialFocus` set | Focus on `<body>` |
| `open` | Modal content; Esc + backdrop close | `onEscapeKeyDown` + `onPointerDownOutside` handled | Cannot dismiss without confirm-button |
| `closing` | Animation, focus returns to trigger | `onCloseAutoFocus` set OR `triggerRef.focus()` in `onClose` | Focus to `<body>` (lost) |
| `unmounted` | Trigger button regains focus | Same as closed | - |

### List / Feed / Table

| State | What user sees | Pass | Fail |
|---|---|---|---|
| `loading` | N skeleton rows matching item layout | `Array.from({length: 5}, …)` of `<RowSkeleton>` | Spinner centered above empty area |
| `empty` | Helpful empty + create CTA | "No invoices yet: Create one" | "No items" |
| `error` | Cause + retry | "Couldn't load: Try again" | Generic toast |
| `partial` (pagination/infinite) | Loaded prefix + spinner row | `<RowSkeleton />` at end | Page jumps when next loads |
| `populated` | Items rendered | - | - |

## Mandatory state pairings

These pairs always go together; one without the other is the bug that ships to production. Pairings a rule owns are checked there (`states-no-empty-state`, `states-no-error-state`, `states-layout-shift`, `forms-lost-data-on-error`, `forms-no-disable-while-submitting`, `async-optimistic-without-rollback`, `a11y-color-only-meaning`, `nav-live-region-feedback`, `focus-broken-focus-trap`, `focus-not-restored`). The rest are coverage, not extra findings.

| Pair | Why they pair | Bug if violated |
|---|---|---|
| `loading` ↔ skeleton with `min-height` | CLS-safe | Skeleton renders at 0×0, then jumps to full content on data arrival (Lighthouse CLS) |
| `empty` ↔ primary CTA | Empty without next-step is a dead-end | "No items" with no CTA; user stalls |
| `error` ↔ retry path | Errors without recovery are dead-ends | "Something went wrong" with no action; user reloads or leaves |
| `error` ↔ preserved input | Re-entering data is hostile | Form clears on 422; user abandons |
| `disabled` ↔ explanation | Mystery disabled buttons confuse | No `aria-disabled` or tooltip; user can't unblock self |
| `pending` ↔ disabled submit | Otherwise double-submit | User clicks twice; backend gets a duplicate record |
| `optimistic` ↔ rollback | Otherwise inconsistent state | Server returns 422; UI keeps the optimistic value until a reload reveals the truth |
| `destructive` ↔ confirm or undo | Mistakes are unrecoverable; a reversible action earns undo instead of a dialog | Data loss with no undo |
| `color-state` ↔ icon/text | Color blindness | Red border without icon or `aria-invalid`; ~8% of users miss the signal |
| `toast` ↔ `aria-live` | SR users miss async alerts | No `aria-live`; screen-reader and slow readers miss a 3 s toast |
| `dialog open` ↔ focus moves in | Keyboard users lose context | Tab key escapes the modal |
| `dialog close` ↔ focus restored | Keyboard users lose their place | Focus lands on `<body>`; Tab restarts from the top |
