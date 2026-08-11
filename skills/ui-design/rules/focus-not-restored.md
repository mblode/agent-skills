---
title: Focus not restored after modal/sheet/popover close
id: focus-not-restored
category: focus
defaultTier: release-blocker
detect: static
related: focus-broken-focus-trap, focus-on-dynamic-content, async-no-error-boundary
---

## Focus not restored after modal/sheet/popover close

When a dialog closes, focus must return to the element that opened it (the trigger). If it does not, keyboard and screen-reader users land on `<body>` and must tab from the top to recover their place. One of the most common accessibility bugs, and invisible to mouse users. Radix and react-aria handle it automatically; hand-rolled dialogs almost never do.

## What goes wrong

User opens "Edit profile" via keyboard, submits, and closes. Focus drops to `<body>`; Tab now jumps to the page header, three sections from where they were working, with no way back without scanning the whole page.

## Detection

**Surfaces:** modal, sheet, drawer, popover, command-palette, any "Forgot password?" trigger.

**Static signals:**
1. `rg 'role="(dialog|alertdialog)"|<Dialog|<Sheet|<Popover' --type=ts -l`.
2. For each, confirm focus-restoration evidence:
   - Radix `onCloseAutoFocus` handler OR not overriding it (Radix default restores).
   - A `triggerRef` passed and `triggerRef.current?.focus()` called on close.
   - react-aria's `<DialogTrigger>` (built-in restoration).
   - `focus-trap-react` with `returnFocusOnDeactivate` (defaults to `true`).
3. Flag dialogs that override `onCloseAutoFocus` with `e.preventDefault()` without focusing another element.

**Concrete commands:**
```bash
# Dialogs missing focus-restoration evidence
rg 'role="dialog"|<Dialog\b|<Sheet\b' --type=ts -l | while read f; do
  rg -q 'onCloseAutoFocus|triggerRef|finalFocus|returnFocusOnDeactivate' "$f" \
    || echo "$f: dialog with no focus restoration"
done

# Cases where onCloseAutoFocus is preventDefault'd
rg -B 1 -A 3 'onCloseAutoFocus' --type=ts | rg 'preventDefault'
```

**False-positive guards:**
- Skip if Radix is used and `onCloseAutoFocus` is not provided (default behaviour restores focus).
- Skip if the dialog closes by navigating to a new route (focus management is the new page's responsibility).
- Skip files annotated `// ui-audit-ignore:focus-not-restored`.

## Fix

Patterns:

**A. Use Radix (no extra code needed):**

```tsx
// Radix handles restoration automatically: leave onCloseAutoFocus alone.
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <button>Edit profile</button>
  </Dialog.Trigger>
  <Dialog.Content>...</Dialog.Content>
</Dialog.Root>
```

**B. Hand-rolled with `triggerRef`:**

```tsx
function EditProfile() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    // Defer to allow unmount before focus
    queueMicrotask(() => triggerRef.current?.focus());
  };

  return (
    <>
      <button ref={triggerRef} onClick={() => setOpen(true)}>
        Edit profile
      </button>
      {open && <MyDialog onClose={close} />}
    </>
  );
}
```

**C. Override Radix carefully** (e.g. focus a confirm result, not the trigger):

```tsx
<Dialog.Content
  onCloseAutoFocus={(e) => {
    e.preventDefault();
    successBannerRef.current?.focus(); // explicit alternative target
  }}
>
```

Docs:
- Radix Dialog onCloseAutoFocus: https://www.radix-ui.com/primitives/docs/components/dialog#content
- react-aria `FocusScope` (`restoreFocus`): https://react-aria.adobe.com/FocusScope
- WCAG 2.4.3 Focus Order: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html

## Default tier and overrides

**Defaults to:** `release-blocker`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in (Forgot password modal) | release-blocker |
| Checkout (address modal) | release-blocker |
| Confirm-delete dialog | release-blocker |
| Marketing newsletter | fix-this-sprint |
| Internal admin | fix-this-sprint |

## Defer-to (when this is another tool's job)

- axe-core: WCAG 2.4.3 (Focus Order) checks at runtime.
- Manual keyboard pass; automated tooling can't always verify "focus returned to the right place."
- Storybook a11y addon for component-level checks.

## Suppression

```tsx
{/* ui-audit-ignore:focus-not-restored, close action navigates to new route, parent owns focus */}
```
