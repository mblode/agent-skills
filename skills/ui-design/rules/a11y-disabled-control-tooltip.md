---
title: Do not put tooltips on disabled controls
id: a11y-disabled-control-tooltip
category: a11y
defaultTier: fix-this-sprint
detect: static
related: a11y-icon-controls-labeled, a11y-tooltip-no-interactive
---

## Do not put tooltips on disabled controls

A tooltip on a `disabled` button never reaches keyboard or screen-reader users: disabled controls are omitted from the tab order, so the reason the action is blocked is invisible. Mouse users see a hover hint; everyone else hits a dead control with no explanation.

Wrap the control and put the message on the wrapper, or keep the control enabled and handle the blocked action with an inline error. Do not use `pointer-events-none` on the button plus a tooltip on a parent as a substitute unless the parent is focusable and named.

## Detection

Search for `disabled` on a control that sits inside a tooltip trigger, or a tooltip whose child is a disabled button.

```bash
rg -nUP '<[^>]*\bdisabled\b[^>]*>[\s\S]{0,400}<(Tooltip|HoverCard)' -g '*.tsx' -g '*.jsx' src/
rg -nUP '<(Tooltip(Trigger)?|HoverCard)[^>]*>[\s\S]{0,500}\bdisabled\b' -g '*.tsx' -g '*.jsx' src/
```

A native `title` on a disabled button matches the same failure. Skip `aria-disabled="true"` controls that remain focusable and expose the reason via `aria-describedby`.

**Incorrect (tooltip on a disabled button):**

```tsx
<Tooltip content="You need billing access">
  <button type="button" disabled>
    Invoice
  </button>
</Tooltip>
```

**Correct (focusable wrapper carries the message):**

```tsx
<Tooltip content="You need billing access">
  <span tabIndex={0} className="inline-flex">
    <button type="button" disabled>
      Invoice
    </button>
  </span>
</Tooltip>
```
