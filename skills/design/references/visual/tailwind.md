# Tailwind and Markup

Markup and Tailwind v4 authoring rules that apply to every component, plus the componentize and class-canonicalize passes.

## Contents

- General
- Flexbox Layout
- Custom Fonts
- Componentize
- Canonicalize Tailwind

## General

Covers: general markup and Tailwind CSS authoring rules not specific to one component.

### Coding Rules

#### Markup

- Never apply `text-*` (font size) or `leading-*` (line height) to inline elements (`<span>`, `<a>`, `<strong>`, `<em>`, `<code>`); apply them to containing block-level elements (`<div>`, `<p>`, `<h1>`, `<h6>`, `<li>`, `<td>`)
- Never add display classes matching an element's default display: no `block` on `<div>`/`<p>`/`<h1>`/`<h6>`; no `inline` on `<span>`/`<a>`; no `inline-block` on `<input>`/`<button>`/`<select>`; no `table` on `<table>`. Only applies to classes that don't change child layout: `flex`, `grid`, `inline-flex`, `inline-grid` are never redundant
- Never apply conflicting classes for the same property on one element without a distinguishing variant: no `outline-1 outline-2`, no `outline-black/5 outline-white`; keep only the intended value
- Always add `role="list"` to `<ul>` and `<ol>` unless a `list-style-*` class (e.g. `list-disc`, `list-decimal`) is applied
- Never add `hover:*` to non-interactive elements: reserve for buttons, links, and other clickables
- Never add `transition-*` for hover color/background changes: reserve transitions for elements that move or transform

#### Tailwind CSS

- Always apply `antialiased` to the root element
- Always apply `isolate` to the main app container (gets `inert` when dialogs open): prevents z-index conflicts with portalled elements
- Place `@import` statements with remote URLs (`http`/`https`) or `url()` at the very top of the CSS file, before `@import "tailwindcss"` (but after `@charset` if present)
- Add `tabular-nums` to elements displaying numbers, especially values that change over time (counters, timers, prices, stats): prevents layout shift as digits update
- Never use `mt-*`/`mb-*`/`ml-*`/`mr-*`/`mx-*`/`my-*` between flex/grid children: use `gap-*` on the parent instead
- Prefer `size-{n}` over `h-{n} w-{n}` when both values are the same
- Prefer shorthand over split axis classes: `p-8` not `px-8 py-8`, `inset-0` not `inset-x-0 inset-y-0`; keep them split when a variant overrides one axis, e.g. `p-8 md:px-10`
- Use `--spacing(…)` for arbitrary spacing values: `--padding: --spacing(2)` not `--padding: 8px`
- Never use `calc(var(--spacing)*…)`: use `--spacing(…)` instead
- Never use `theme(spacing.…)`: use `--spacing(…)` instead
- Never use `theme()` for colors or other tokens in arbitrary values: use CSS variables instead; `[stop-color:var(--color-emerald-500)]` not `[stop-color:theme(colors.emerald.500)]`
- Use `rem` for arbitrary font sizes: `text-[0.8125rem]` not `text-[13px]`
- Pixels are fine for properties that use pixels natively in Tailwind: `border-*`, `outline-*`
- Use theme variable references for arbitrary radii: `--radius: var(--radius-xl)` not `--radius: 16px`
- Never use named line-height values (`tight`, `snug`, `relaxed`): not in `leading-tight`, not in `text-6xl/tight`; only spacing scale values (e.g. `leading-6`, `text-sm/5`), and only when a custom line height is specifically required
- Never use inline `style` for static CSS properties lacking a utility class: use arbitrary property syntax instead; `class="[animation-delay:300ms]"` not `style="animation-delay: 300ms"`
- Set CSS variables with arbitrary property syntax, not inline styles: `class="[--padding:--spacing(3)]"` not `style="--padding: --spacing(3)"` (unless the value is dynamic)
- For dynamic values, prefer CSS variables over CSS properties in `style`: `class="w-(--progress)" style="--progress: 72%"` not `style="width: 72%"`; name the variable descriptively relative to the context
- Prefer bare values over arbitrary values for integers and multiples of `0.25`: `z-999` not `z-[999]`
- Prefer bare opacity modifiers on color utilities: `bg-neutral-950/2` not `bg-neutral-950/[0.02]`; use `[…]` only for non-`0.25`-increment values
- Negate `hidden` with a single conditional variant instead of setting `hidden` then re-applying the display class: `flex items-center gap-x-6 max-lg:hidden` not `hidden lg:flex lg:items-center lg:gap-x-6`; `not-dark:hidden` not `hidden dark:block`
- Prefer `not-*` variants over a base value with conditional override: `group-not-has-checked:opacity-0` not `group-has-checked:opacity-100 opacity-0`; place `not-` directly before the negated state, not `not-group-has-checked:…` (fires without a `group` parent) or `group-has-not-checked:…` (matches any unchecked element)
- Use bare values in variants over arbitrary values in variants: `data-closed:…` not `data-[closed]:…`, `group-data-open:…` not `group-data-[open]:…`
- Always use `min-h-dvh/svh/lvh`, never `min-h-screen` (`screen` is deprecated)
- Always use `bg-linear-*` for gradients, never `bg-gradient-*` (deprecated)
- Use `shrink-*` not `flex-shrink-*`, `grow-*` not `flex-grow-*` (deprecated)
- Prefer whole-number ratios in arbitrary grid/flex values: `grid-cols-[21fr_19fr]` not `grid-cols-[1.05fr_0.95fr]`; multiply all values by the same factor to eliminate decimals
- Prefer `@utility my-utility { … }` over plain class selectors (`.my-utility { … }`): utilities work with all Tailwind variants (`hover:my-utility`, `lg:my-utility`)
- Use `@utility my-utility-* { … }` with `--value()` and `--modifier()` for parameterized utilities that accept arguments
- Use `@variant the-variant { … }` inside `@utility` definitions to apply an existing variant: don't manually write the media query or selector
- Use `@custom-variant` to define new custom variants when the built-in set doesn't cover the case
- Never nest `@utility` inside another at-rule (`@media`, `@supports`): move the at-rule inside the `@utility` block instead

## Flexbox Layout

Covers: flex containers, flexible children, fixed-size icons/images, truncation, sidebars, layouts using `flex-1`, `min-w-0`, or `shrink-0`.

- Add `min-w-0` (or `min-width: 0`) to flex children that must shrink below their content size: flex items default to `min-width: auto` and won't shrink past their content without it. Applies at every scale, from page-level layouts (a fluid content area next to a fixed-width sidebar using `flex-1`) down to small UI pieces (a truncated text label in a row, a flexible input next to a fixed button).
- Add `shrink-0` to flex children that should never shrink: icons, SVGs, images, logos, avatars, and any element that would become visually distorted if compressed.

## Custom Fonts

Covers: loading custom fonts, registering font theme variables, applying display/body font utilities.

- Load custom fonts before using them: add `<link>` tags in the HTML `<head>` (preferred); if no `<head>` exists, use `@import url('…');` at the top of the CSS file instead.
- Register frequently used custom fonts in the CSS `@theme` block: e.g. `--font-display: "Oswald", sans-serif;`; optionally set `--font-display--font-feature-settings` and `--font-display--font-variation-settings` for fine-tuning.
- Register headline/display fonts as `--font-display` (creates a `font-display` utility): use `--font-sans` for body/UI fonts and `--font-display` for fonts used only on headings and display text; apply `font-display` on headings alongside `font-sans` on the body.

## Componentize

Use when componentizing, extracting, or organizing UI code into reusable components, or cleaning up Tailwind class lists.

### Load First

- For Tailwind class cleanup (standalone or finishing pass), use Canonicalize Tailwind below.
- Component extraction needs no companion files.

### Workflow

1. Inspect existing project component patterns before creating new ones.
2. Identify repeated patterns, logical sections, and self-contained UI blocks.
3. Extract components with call-site spacing and configurable class merging.
4. Reuse or extend existing project components where available.
5. Re-scan extracted components for remaining duplication.
6. Finish with a Tailwind canonicalize pass over the touched class lists (Canonicalize Tailwind below).

### Rules

- Break designs into small, focused components instead of one large component: extract repeated patterns, logical sections, and self-contained UI blocks
- Never bake margins into components: apply margins at the call site; every component must accept a `class` attribute and merge it with the classes on the component's top-level element
- Use the project's existing class-merging helper (`cn` in a shadcn/Tailwind project, from the [`cn`](https://github.com/shadcn-ui/cn) package) to merge classes in client-side components
- Always extract form controls into reusable components organized by HTML element: one `Input` for all `<input>` types (text, email, password, etc.), one `Select` for `<select>`, one `Textarea` for `<textarea>`; never type-specific components like `EmailInput` or `PasswordInput`; check the project for existing ones first
- When two or more elements share the same structure and styling but differ only in props (labels, placeholders, types): extract them into a single component parameterized by those differences
- After extracting, scan components for duplicated patterns and extract shared elements into reusable components: e.g. repeated section container/max-width/padding wrappers, heading group structures (eyebrow + heading + subheading), card shells, button styles
- Always use existing project components when available: reuse or extend instead of creating new ones; buttons and form elements are especially common candidates

### Verify

- Extracted components preserve the original UI and behavior.

## Canonicalize Tailwind

Use when the user wants to clean up, canonicalize, or normalize Tailwind class lists.

### Workflow

1. Identify Tailwind class strings in the requested files or components.
2. Canonicalize them with `npx @tailwindcss/cli canonicalize`.
3. Apply the changed strings back to the source.
4. Run the project's formatter or relevant checks when available.

### Commands

- `npx @tailwindcss/cli canonicalize` collapses shorthands (`mt-2 mr-2 mb-2 ml-2` → `m-2`), resolves overrides (`py-3 p-1 px-3` → `p-3`), canonicalizes arbitrary values to named utilities, and sorts classes; pass `--css path/to/input.css` if the project uses a custom CSS entry file.

  Single class string:

  ```sh
  npx @tailwindcss/cli canonicalize "mt-2 mr-2 mb-2 ml-2"
  # m-2
  ```

  Multiple strings as positional args (each on its own line):

  ```sh
  npx @tailwindcss/cli canonicalize "py-3 p-1 px-3" "mt-2 mr-2 mb-2 ml-2"
  # p-3
  # m-2
  ```

  Pipe strings via stdin (one per line):

  ```sh
  echo "py-3 p-1 px-3\nmt-2 mr-2 mb-2 ml-2" | npx @tailwindcss/cli canonicalize
  # p-3
  # m-2
  ```

  `--format json` or `--format jsonl` gives structured output with `input`/`output`/`changed` fields:

  ```sh
  npx @tailwindcss/cli canonicalize --format json "py-3 p-1 px-3"
  # [{ "input": "py-3 p-1 px-3", "output": "p-3", "changed": true }]
  ```

  `--stream` processes stdin line-by-line without buffering:

  ```sh
  npx @tailwindcss/cli canonicalize --stream
  ```

### Verify

- Confirm classes still express the same visual intent after canonicalization.
