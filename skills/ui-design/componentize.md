# Componentize

Use when componentizing, extracting, or organizing UI code into reusable components, or cleaning up Tailwind class lists.

## Load First

- For Tailwind class cleanup (standalone or finishing pass), load [canonicalize-tailwind.md](./canonicalize-tailwind.md) for the `npx @tailwindcss/cli canonicalize` workflow and commands.
- Component extraction needs no companion files.

## Workflow

1. Inspect existing project component patterns before creating new ones.
2. Identify repeated patterns, logical sections, and self-contained UI blocks.
3. Extract components with call-site spacing and configurable class merging.
4. Reuse or extend existing project components where available.
5. Re-scan extracted components for remaining duplication.
6. Finish with a Tailwind canonicalize pass over the touched class lists ([canonicalize-tailwind.md](./canonicalize-tailwind.md)).

## Rules

- Break designs into small, focused components instead of one large component: extract repeated patterns, logical sections, and self-contained UI blocks
- Never bake margins into components: apply margins at the call site; every component must accept a `class` attribute and merge it with the classes on the component's top-level element
- Use `clsx` or similar to merge classes in client-side components
- Always extract form controls into reusable components organized by HTML element: one `Input` for all `<input>` types (text, email, password, etc.), one `Select` for `<select>`, one `Textarea` for `<textarea>`; never type-specific components like `EmailInput` or `PasswordInput`; check the project for existing ones first
- When two or more elements share the same structure and styling but differ only in props (labels, placeholders, types): extract them into a single component parameterized by those differences
- After extracting, scan components for duplicated patterns and extract shared elements into reusable components: e.g. repeated section container/max-width/padding wrappers, heading group structures (eyebrow + heading + subheading), card shells, button styles
- Always use existing project components when available: reuse or extend instead of creating new ones; buttons and form elements are especially common candidates

## Verify

- Extracted components preserve the original UI and behavior.
