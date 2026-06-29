# Ideas

Use when the user wants the ui.sh picker to compare and pick between multiple UI implementations while previewing them in the browser.

## Contents

- [Start](#start)
- [Workflow](#workflow)
- [Verify](#verify)
- [Markup Patterns](#markup-patterns)
- [Guardrails](#guardrails)

## Start

- If Options mode already ran in this conversation/project, run an iteration reset pass first.
- Use the currently selected/visible UI as the baseline.
- Remove lingering artifacts from earlier rounds: old unselected branches, stale `hidden` attributes, and picker wrappers/attributes no longer needed.
- Keep one toolbar script tag if the user is still comparing; remove duplicates only.
- Get each area back to one clean implementation before generating new options.

## Workflow

1. Define picker decision points before coding:
   - Give each a human-readable label (for example `Hero style`, `Pricing layout`).
   - Reuse existing option labels when variants are already named.
   - When the current implementation is included, suffix its label with `(current)` (for example `Minimal (current)`).
2. Annotate each decision with UI picker attributes:
   - Parent wrapper: `data-uidotsh-pick="Human readable label"`
   - Option nodes: `data-uidotsh-option="Human readable option"`
   - When the current implementation is included, it must be the first option and include `(current)` in its label.
   - Exactly one option visible; all others use `hidden`.
   - Apply the Tailwind CSS `contents` class to wrapper and option nodes so wrappers don't affect layout.
3. After all variants are annotated, inject the toolbar script once in a shared app layout/root shell (prefer framework-native script APIs):
   - Laravel: if `resources/views/layouts/app.blade.php` exists, inject there once, right before `</body>`.
   - TanStack: update `src/routes/__root.tsx` and inject via the `scripts` array returned from the `head` option in `createRootRoute` (do not add a raw `<script>` tag in the route component markup).
   - Nuxt: use the `useHead` composable in the root `app.vue` (or a layout file such as `layouts/default.vue`).
   - Vite: if an `index.html` exists in the project root, inject there once, right before `</body>`.
   - Next.js: use `next/script` (plain `<script>` in JSX can fail to execute until a full refresh in dev):

   ```tsx
   import Script from 'next/script'

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en">
         <body>
           {children}
           <Script src="https://ui.sh/ui-picker.js" />
         </body>
       </html>
     )
   }
   ```

   - With no framework script primitive, inject a plain script tag once in the shared root layout, right before `</body>`:

   ```html
   <script src="https://ui.sh/ui-picker.js"></script>
   ```

   - Do not place the script in leaf component files; keep injection idempotent (no duplicates).

4. Let the user preview variants in-browser with the picker toolbar.
5. If the toolbar can't load (for example CSP/offline), skip preview and ask for selection in chat using labels and descriptions.
6. Ask for selection in the agent using the `question` tool:
   - Use explicit option labels matching the UI picker labels.
   - For existing-design variation requests, keep the current implementation as the first choice and preserve its `(current)` suffix.
   - Keep custom input enabled (so `Type your own answer` stays available).
   - For multiple decision points, ask one question per decision.
7. Finalize after selection:
   - Keep only selected variants.
   - Remove unselected variants and now-unneeded picker wrapper attributes.
   - Remove lingering `hidden` attributes and empty picker-scaffolding wrappers.
   - Remove temporary variant-scaffolding comments/suppressions.
   - Remove picker script usage first, then now-unused script-related imports (ideally in one file update) so intermediate saves do not create an invalid state.
   - If the user wants another comparison round, keep a single toolbar script tag for faster iteration.
   - If done comparing (or asked for final cleanup), remove the toolbar script and remaining picker-only scaffolding.

## Verify

- Check desktop and mobile layouts.
- No broken semantics or duplicate `id` attributes in surviving markup.
- Ensure no old picker artifacts remain before ending, unless intentionally preparing a fresh comparison immediately.

## Markup Patterns

### HTML Example

```html
<div data-uidotsh-pick="Hero style" class="contents">
  <div data-uidotsh-option="Minimal" class="contents">...</div>
  <div data-uidotsh-option="Bold" class="contents" hidden>...</div>
  <div data-uidotsh-option="Editorial" class="contents" hidden>...</div>
</div>
```

### React/TSX Example

```tsx
<div data-uidotsh-pick="Hero style" className="contents">
  <div data-uidotsh-option="Minimal" className="contents">
    ...
  </div>
  <div data-uidotsh-option="Bold" className="contents" hidden>
    ...
  </div>
</div>
```

## Guardrails

- Do all variant work in existing source files (no standalone preview file).
- Give concise progress updates across major phases.
- Mark every decision with `data-uidotsh-pick` + `data-uidotsh-option`, and apply the Tailwind CSS `contents` class to wrapper and option nodes.
- Exactly one option starts visible; all others start `hidden`. When the current implementation is included, it is option 1 with `(current)` in its label.
- Clean previous unselected picker artifacts before starting a new round.
- Inject the picker script only after variants are in place; use framework script APIs where available (Next.js: `next/script`).
- During cleanup, remove script tags/usages before deleting related imports; remove the picker script only when the user is done comparing or asks for final cleanup.
- Ask for final selection in the agent, then remove all unpicked variants.
