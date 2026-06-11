# Ideas

Use this when the user wants to use the ui.sh picker to see and pick between multiple UI implementations while previewing them in the browser.

## Contents

- [Start](#start)
- [Workflow](#workflow)
- [Verify](#verify)
- [Markup Patterns](#markup-patterns)
- [Guardrails](#guardrails)

## Start

- If Options mode has already been run in the same conversation/project, run an iteration reset pass first.
- Use the currently selected/visible UI as the baseline.
- Remove lingering artifacts from earlier rounds: old unselected branches, stale `hidden` attributes, and picker wrappers/attributes that are no longer needed.
- Keep one toolbar script tag if the user is still comparing options; remove duplicates only.
- Ensure each area is back to one clean implementation before generating new options.

## Workflow

1. Define picker decision points before coding:
   - Give each decision a human-readable label (for example: `Hero style`, `Pricing layout`).
   - Use existing option labels when variants already have names.
   - When the current implementation is included, suffix its option label with `(current)` (for example: `Minimal (current)`).
2. Annotate each decision with UI picker attributes:
   - Parent wrapper: `data-uidotsh-pick="Human readable label"`
   - Option nodes: `data-uidotsh-option="Human readable option"`
   - When the current implementation is included, it must be the first option and include `(current)` in its option label.
   - Exactly one option visible; all others use `hidden`
   - Apply the Tailwind CSS `contents` class to wrapper and option nodes so wrappers do not affect layout
3. After all variants are annotated, inject the toolbar script once in a shared app layout/root shell:
   - Prefer framework-native script APIs when available.
   - For Laravel, if `resources/views/layouts/app.blade.php` exists, inject the script there once, right before `</body>`.
   - For TanStack projects, update `src/routes/__root.tsx` and inject the picker via the `scripts` array returned from the `head` option in `createRootRoute` (do not add a raw `<script>` tag in the route component markup).
   - For Nuxt projects, use the `useHead` composable in the root `app.vue` (or a layout file such as `layouts/default.vue`) to inject the script.
   - For Vite projects, if an `index.html` exists in the project root, inject the script there once, right before `</body>`.
   - For Next.js, use `next/script` (plain `<script>` in JSX can fail to execute until a full refresh in dev):

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

   - If there is no framework script primitive, inject a plain script tag once in the shared root layout, right before `</body>`:

   ```html
   <script src="https://ui.sh/ui-picker.js"></script>
   ```

   - Do not place the script in leaf component files, and keep injection idempotent (do not add duplicates).

4. Let the user preview variants in-browser with the picker toolbar.
5. If the toolbar cannot load (for example CSP/offline), skip preview and ask for selection in chat using labels and descriptions.
6. Ask for selection in the agent using the `question` tool:
   - Use explicit option labels matching the UI picker labels.
   - For existing-design variation requests, keep the current implementation as the first choice and preserve the `(current)` suffix in the label.
   - Keep custom input enabled (so `Type your own answer` remains available).
   - For multiple decision points, ask one clear question per decision.
7. Finalize after selection:
   - Keep only selected variants.
   - Remove unselected variants and any now-unneeded picker wrapper attributes.
   - Remove lingering `hidden` attributes and empty wrappers created only for picker scaffolding.
   - Remove temporary comments/suppressions used only for variant scaffolding.
   - During cleanup, remove picker script usage/usages first, then remove any now-unused script-related imports (ideally in one file update) so intermediate saves do not create an invalid state.
   - If the user wants another comparison round, keep a single toolbar script tag in place for faster iteration.
   - If the user is done comparing (or asks for final cleanup), remove the toolbar script and any remaining picker-only scaffolding.

## Verify

- Check desktop and mobile layouts.
- Ensure no broken semantics or duplicate `id` attributes across surviving markup.
- Ensure no old picker artifacts remain before ending the run unless intentionally preparing a fresh new comparison immediately.

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
- Provide concise user-facing progress updates across major phases.
- Use `data-uidotsh-pick` + `data-uidotsh-option` markers for every decision.
- Use the Tailwind CSS `contents` class on wrapper and option nodes.
- When the current implementation is included, option 1 must be the current implementation and include `(current)` in its label.
- Exactly one option starts visible; all others start `hidden`.
- Before starting a new suggestion/options round, clean previous unselected picker artifacts so nothing old lingers.
- Ask for final selection in the agent, then remove all unpicked variants.
- Inject the picker script only after variants are in place; use framework script APIs when available (for Next.js: `next/script`).
- During cleanup, remove script tags/usages before deleting related imports so stepwise saves never leave unresolved references.
- Remove the picker script only when the user is done comparing or explicitly asks for final cleanup.
