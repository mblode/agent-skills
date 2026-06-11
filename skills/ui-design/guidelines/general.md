# General

Covers: general markup rules and Tailwind CSS authoring rules that are not specific to one component.

## Coding Rules

### Markup

- Never apply `text-*` (font size) or `leading-*` (line height) classes to inline elements like `<span>`, `<a>`, `<strong>`, `<em>`, or `<code>`: always apply them to containing block-level elements like `<div>`, `<p>`, `<h1>`, `<h6>`, `<li>`, or `<td>`
- Never add redundant display classes that match an element's default display: e.g. no `block` on `<div>`, `<p>`, `<h1>`, `<h6>`; no `inline` on `<span>`, `<a>`; no `inline-block` on `<input>`, `<button>`, `<select>`; no `table` on `<table>`. This only applies to classes that don't change child layout, `flex`, `grid`, `inline-flex`, `inline-grid` are never redundant
- Never apply conflicting classes for the same property on the same element without a distinguishing variant: e.g. no `outline-1 outline-2`, no `outline-black/5 outline-white`; keep only the intended value
- Always add `role="list"` to `<ul>` and `<ol>` elements unless a `list-style-*` class (e.g. `list-disc`, `list-decimal`) is applied

### Tailwind CSS

- Always apply `antialiased` to the root element
- Always apply `isolate` to the main app container (the element that gets `inert` when dialogs open): prevents z-index conflicts with portalled elements
- Place `@import` statements with remote URLs (`http`/`https`) or `url()` at the very top of the CSS file, before `@import "tailwindcss"`: but after `@charset` if present
- Add `tabular-nums` to elements that display numbers, especially values that change over time (e.g. counters, timers, prices, stats): prevents layout shift as digits update
- Never use `mt-*`/`mb-*`/`ml-*`/`mr-*`/`mx-*`/`my-*` between flex/grid children: use `gap-*` on the parent instead
- Prefer `size-{n}` over `h-{n} w-{n}` when both values are the same
- Prefer shorthand classes over split axis classes: `p-8` not `px-8 py-8`, `inset-0` not `inset-x-0 inset-y-0`; keep them split when a variant overrides one axis, e.g. `p-8 md:px-10`
- Use `--spacing(…)` for arbitrary spacing values: `--padding: --spacing(2)` not `--padding: 8px`
- Never use `calc(var(--spacing)*…)`: use `--spacing(…)` instead
- Never use `theme(spacing.…)`: use `--spacing(…)` instead
- Never use `theme()` for colors or other tokens in arbitrary values: use CSS variables instead; `[stop-color:var(--color-emerald-500)]` not `[stop-color:theme(colors.emerald.500)]`
- Use `rem` for arbitrary font sizes: `text-[0.8125rem]` not `text-[13px]`
- Pixels are fine for properties that use pixels natively in Tailwind: e.g. `border-*`, `outline-*`
- Use theme variable references for arbitrary radii: `--radius: var(--radius-xl)` not `--radius: 16px`
- Never use named line-height values like `tight`, `snug`, `relaxed`: not in `leading-tight`, not in `text-6xl/tight`; only use spacing scale values (e.g. `leading-6`, `text-sm/5`), and only when a custom line height is specifically required
- Never use inline `style` attributes for static CSS properties that lack a utility class: use arbitrary property syntax instead; `class="[animation-delay:300ms]"` not `style="animation-delay: 300ms"`
- Set CSS variables using arbitrary property syntax, not inline styles: `class="[--padding:--spacing(3)]"` not `style="--padding: --spacing(3)"` (unless the value is dynamic)
- For dynamic values, prefer CSS variables over setting CSS properties directly in `style` attributes: `class="w-(--progress)" style="--progress: 72%"` not `style="width: 72%"`; name the variable descriptively relative to the context
- Prefer bare values over arbitrary values for integers and multiples of `0.25`: `z-999` not `z-[999]`
- Prefer bare opacity modifiers on color utilities: `bg-neutral-950/2` not `bg-neutral-950/[0.02]`; use `[…]` only for non-`0.25`-increment values
- Negate `hidden` with a single conditional variant instead of setting `hidden` and conditionally re-applying the display class: `flex items-center gap-x-6 max-lg:hidden` not `hidden lg:flex lg:items-center lg:gap-x-6`; `not-dark:hidden` not `hidden dark:block`
- Prefer `not-*` variants over setting a base value and conditionally overriding it: `group-not-has-checked:opacity-0` not `group-has-checked:opacity-100 opacity-0`; place `not-` directly before the state being negated, not `not-group-has-checked:…` (would trigger without a `group` parent) or `group-has-not-checked:…` (would match any unchecked element)
- Use bare values in variants over arbitrary values in variants: `data-closed:…` not `data-[closed]:…`, `group-data-open:…` not `group-data-[open]:…`
- Always use classes like `min-h-dvh/svh/lvh`, never `min-h-screen` (`screen` is deprecated)
- Always use `bg-linear-*` for gradients, never `bg-gradient-*` (deprecated)
- Use `shrink-*` not `flex-shrink-*`, `grow-*` not `flex-grow-*` (deprecated)
- Prefer whole-number ratios in arbitrary grid/flex values: `grid-cols-[21fr_19fr]` not `grid-cols-[1.05fr_0.95fr]`; multiply all values by the same factor to eliminate decimals
- Prefer `@utility my-utility { … }` over plain class selectors (`.my-utility { … }`) for reusable styles: utilities work with all Tailwind variants (`hover:my-utility`, `lg:my-utility`)
- Use `@utility my-utility-* { … }` with `--value()` and `--modifier()` for parameterized utilities that accept arguments
- Use `@variant the-variant { … }` inside `@utility` definitions to apply an existing variant: don't manually write the media query or selector
- Use `@custom-variant` to define new custom variants when the built-in set doesn't cover the case
- Never nest `@utility` inside another at-rule like `@media` or `@supports`: move the at-rule inside the `@utility` block instead
