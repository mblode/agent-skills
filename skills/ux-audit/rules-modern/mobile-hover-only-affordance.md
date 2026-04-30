---
title: Critical actions hidden behind hover-only affordances
slug: mobile-hover-only-affordance
category: mobile
defaultTier: fix-this-sprint
surfaces: list, dashboard, modal, toast, search
react-apis: n/a (CSS-only)
related: mobile-subpar-target-size, focus-on-dynamic-content
---

## Critical actions hidden behind hover-only affordances

Reveal-on-hover is a desktop-era pattern that quietly disappears on touch devices: a list row exposes "Edit / Delete / Share" only when the cursor enters, but a phone has no cursor. Users on touch never discover the actions, or they discover them via a frustrating long-press. The same pattern hides tooltips, secondary CTAs, and meaningful state ("3 unread") behind `:hover`. CSS `@media (hover: hover)` and `@media (pointer: fine)` can scope hover-reveal to actual hover-capable input, but most codebases skip this and ship a desktop-only experience to mobile.

## What goes wrong

A row uses `opacity-0 group-hover:opacity-100` to lazily reveal action buttons. On desktop the cursor enters and three buttons fade in. On mobile the row is tapped, navigates to a detail view, and the user never sees the inline actions at all. Same pattern hides "X" close buttons on cards, "Copy link" affordances on code blocks, and tooltip content carrying real information.

## Detection

**Surfaces:** list / feed / inbox rows, dashboard widget actions, code-block toolbars, tooltips, modal hover-reveal patterns.

**Static signals:**
1. Grep for hover-only visibility classes: `hover:opacity-100`, `hover:visible`, `group-hover:opacity-`, `peer-hover:opacity-`, `hover:flex`, `hover:block`.
2. For each match, find the paired hidden state (`opacity-0`, `invisible`, `hidden`).
3. Confirm whether the parent has `@media (hover: hover)` scoping (`hover-hover:` plugin or custom CSS).
4. Confirm whether a click/tap fallback exists (kebab menu, long-press, or always-visible variant).
5. Flag if (1) the element is interactive (button, link, action) **and** (2) no fallback exists.

**Concrete commands:**
```bash
# Tailwind reveal-on-hover patterns
rg -n '(group-hover|peer-hover|\bhover:):(opacity-100|visible|flex|block)' --type=tsx

# Pure CSS hover-reveal
rg -n ':hover\s*\{[^}]*(opacity:\s*1|visibility:\s*visible|display:)' --type=css

# Title-only tooltips (carry info, no fallback)
rg -n 'title="[^"]{20,}"' --type=tsx
```

**False-positive guards:**
- Skip if hover styling is purely cosmetic (color shift, scale animation) and the action remains tappable.
- Skip if the file uses `@media (hover: hover)` to gate the hover-reveal.
- Skip if a touch fallback exists in the same component (kebab menu, `MoreActions` popover, always-visible mobile variant).
- Skip files with `// ux-audit-ignore:mobile-hover-only-affordance` near the match.

## Fix

Two-layer fix: scope hover to hover-capable input, and provide a touch fallback.

```tsx
// before — actions invisible on touch
<li className="group relative">
  <a href={item.url}>{item.title}</a>
  <div className="absolute right-2 opacity-0 group-hover:opacity-100">
    <button onClick={onEdit}>Edit</button>
    <button onClick={onDelete}>Delete</button>
  </div>
</li>

// after — visible on touch, reveal-on-hover on desktop, focus-visible for keyboard
<li className="group relative">
  <a href={item.url}>{item.title}</a>
  <div
    className="absolute right-2
               opacity-100
               [@media(hover:hover)]:opacity-0
               [@media(hover:hover)]:group-hover:opacity-100
               [@media(hover:hover)]:group-focus-within:opacity-100"
  >
    <button onClick={onEdit}>Edit</button>
    <button onClick={onDelete}>Delete</button>
  </div>
</li>
```

For tooltip content carrying real information, switch to a focus-visible + click-to-toggle popover (e.g. Radix `Popover`, not `Tooltip`):

```tsx
<Popover.Root>
  <Popover.Trigger aria-label="More info">
    <InfoIcon />
  </Popover.Trigger>
  <Popover.Content>{helpText}</Popover.Content>
</Popover.Root>
```

Reference docs:
- MDN `@media (hover)`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
- MDN `(pointer: fine|coarse)`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer
- Tailwind hover-hover variant docs: https://tailwindcss.com/docs/hover-focus-and-other-states#pointer-and-any-pointer

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Sign-up | n/a (rare) |
| Checkout | release-blocker (any "remove item" or "edit address" hidden) |
| List / feed | fix-this-sprint |
| Marketing landing | backlog |
| Internal admin | backlog |

## Examples

**Anti-pattern (fails):**

```tsx
<div className="group">
  <span>{file.name}</span>
  <button className="opacity-0 group-hover:opacity-100" onClick={onDelete}>
    Delete
  </button>
</div>
```

**Applied (passes):**

```tsx
<div className="group">
  <span>{file.name}</span>
  <button
    className="opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100"
    onClick={onDelete}
  >
    Delete
  </button>
</div>
```

## Defer-to (when this is another tool's job)

- **Playwright** with mobile emulation can verify the action is reachable: https://playwright.dev/docs/emulation#devices
- **eslint-plugin-jsx-a11y** catches some related patterns (`title` carrying critical info) — link, don't restate.

## Suppression

```tsx
{/* ux-audit-ignore:mobile-hover-only-affordance — purely cosmetic hover state */}
<div className="hover:bg-muted" />
```
