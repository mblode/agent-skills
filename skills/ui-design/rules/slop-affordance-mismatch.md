---
title: Affordance styling with nothing behind it
id: slop-affordance-mismatch
category: slop
defaultTier: backlog
detect: static
related: interaction-keyboard-operable, interaction-focus-visible, nav-semantic-links
---

## Affordance styling with nothing behind it

A card lifts on hover, the cursor turns into a hand, the border brightens, and clicking does nothing. The user has already committed to the click by the time they learn it was a decoration; they click again, assume the page is broken or slow, and then trust the next hover state less. This is worse than a plainly inert card, because a plainly inert card never made a promise. It is especially costly on touch, where the hover state never appears and the user has only the visual weight of the element to go on.

The promise is the problem: styling that says "interactive" on something that has no behaviour.

## Ownership

**This rule detects one thing only: decoration that promises interactivity and does not deliver.** Three adjacent failures are owned elsewhere, and reporting them here is double-reporting:

| Symptom | Owner |
|---|---|
| `onClick` on a `<div>`, no keyboard path | `interaction-keyboard-operable` |
| `href="#"` or a click handler used for navigation | `nav-semantic-links` |
| An interactive element with no visible focus style | `interaction-focus-visible` |

If the element has a handler, it is not this rule. Hand it to the owner above and move on.

## Detection

Find candidate affordance styling, then confirm the element has no behaviour.

```bash
rg -nP 'cursor-pointer|hover:(bg|shadow|scale|border|ring|translate)-' \
   -g '*.tsx' -g '*.jsx' -g '!*.stories.tsx' -g '!*.test.tsx' src/
```

For each hit, read the element and fire only if **all** of these hold:

1. no `onClick`, `onPointerDown`, `onMouseDown`, `onKeyDown`, or `onSubmit`,
2. no `href`, `to`, or `action`,
3. no `role="button"`, `role="link"`, `role="option"`, `role="menuitem"`, or similar,
4. it is not itself a `<button>`, `<a>`, `<label>`, `<summary>`, or form control,
5. it contains no interactive descendant.

Report `file:line`, the element, and the promising class.

## False positives

Every one of these will appear in the raw grep. Confirm against all five before reporting:

- **`cursor-pointer` on a `<label>` is correct.** The label is genuinely clickable: clicking it focuses or toggles its control. Same for `<summary>` and for `<option>`.
- **The handler is frequently not on the line you are reading.** Event delegation puts one `onClick` on a list and styles each row; spread props (`{...props}`, `{...getItemProps()}`) carry handlers invisibly. **Skip when props are spread onto the element, and skip when a parent within 10 lines has an `onClick`, `href`, or `role`.**
- **`group` / `group-hover` reveal patterns are legitimate.** A row styled with `group` that reveals a real `<button>` on hover is correct: the hover affordance belongs to the descendant, and the parent is the hit area for the eye rather than the pointer. If an interactive descendant exists inside the group, do not report.
- **Radix, Headless UI, and Base UI render the interactive element downstream.** `asChild`, `<Slot>`, `<Dialog.Trigger>`, `<Popover.Button>`, `<Menu.Item>`, and every `*Trigger` component attach behaviour to a child or via a hook. There will be no `onClick` in the source and the element is still fully interactive. Skip these.
- **Drag handles and sortable items** get their behaviour from a hook's ref, not from a JSX handler.

When the evidence is ambiguous after these checks, do not report. The whole value of this rule is that its findings are real.

## Fix

Either deliver the interaction or drop the promise.

```tsx
// before: hover says clickable, nothing happens
<div className="cursor-pointer rounded-lg border p-4 hover:shadow-md hover:border-gray-300">
  <h3>Billing</h3>
  <p>Manage your plan and invoices.</p>
</div>

// after (a): make the whole card the link it was pretending to be
<Link href="/settings/billing" className="block rounded-lg border p-4 hover:shadow-md hover:border-gray-300">
  <h3>Billing</h3>
  <p>Manage your plan and invoices.</p>
</Link>

// after (b): it is a static panel, so let it look like one
<div className="rounded-lg border p-4">
  <h3>Billing</h3>
  <p>Manage your plan and invoices.</p>
</div>
```

## Why this needs a rule

Styling and behaviour are usually written in separate passes, and the hover state looks correct in every static rendering, so the mismatch only surfaces when someone actually clicks.

## Default tier and overrides

**Defaults to:** `backlog`

| Surface | Tier |
|---|---|
| Primary navigation, dashboards, list and card grids | fix-this-sprint |
| Checkout or onboarding steps | fix-this-sprint |
| Marketing landing page | backlog |
| Internal admin tools | backlog |

Never a release blocker: nothing is lost or broken, the user is misled and recovers.

## Suppression

```tsx
{/* ui-audit-ignore:slop-affordance-mismatch, handler is attached by the parent list via delegation */}
```
