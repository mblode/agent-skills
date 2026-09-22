---
title: Hover tooltips must not contain interactive content
id: a11y-tooltip-no-interactive
category: a11y
defaultTier: fix-this-sprint
detect: static
related: a11y-disabled-control-tooltip, interaction-keyboard-operable
---

## Hover tooltips must not contain interactive content

A hover tooltip that contains a link, button, or input cannot be used with a keyboard or a touch screen, and it vanishes when the pointer moves to reach the inner control. Users see an action they cannot activate reliably.

Put actions in a focusable popover, dropdown, or dialog that opens on click or keyboard. Hover tooltips are for short non-interactive names and descriptions.

## Detection

Search tooltip content slots for nested interactive elements.

```bash
rg -nUP '<(Tooltip(Content)?|HoverCard(Content)?)[^>]*>[\s\S]{0,800}<(button|a |input|select|textarea)\b' -g '*.tsx' -g '*.jsx' src/
```

Radix/Base UI `Popover` and `DropdownMenu` match similar names but are click/keyboard surfaces: skip those. A single icon that is `aria-hidden` decoration inside the tooltip is not interactive.

**Incorrect (button inside a hover tooltip):**

```tsx
<Tooltip>
  <TooltipTrigger>Plan</TooltipTrigger>
  <TooltipContent>
    Pro includes SSO.
    <button type="button" onClick={upgrade}>
      Upgrade
    </button>
  </TooltipContent>
</Tooltip>
```

**Correct (actions live in a popover):**

```tsx
<Popover>
  <PopoverTrigger>Plan</PopoverTrigger>
  <PopoverContent>
    Pro includes SSO.
    <button type="button" onClick={upgrade}>
      Upgrade
    </button>
  </PopoverContent>
</Popover>
```
