---
name: ui-design
description: >-
  Designs and builds UI: visual direction, Tailwind implementation,
  browser-comparable variants, screenshot-to-markup scaffolds, dark-mode and
  responsive retrofits, component extraction, and Tailwind cleanup. Use when
  asked to "build a landing page", "create a dashboard", "make this look
  premium", "pick a visual style", "design the UI", "show me 3 options",
  "create a brand kit", "turn this screenshot into markup", "add dark mode",
  "make this responsive", "clean up the Tailwind", "remove AI slop", "make
  this look less AI-generated", "simplify this UI", or "polish this vibe-coded
  UI". For product behavior use product-design; for audit-only requests use
  ui-audit; for motion use ui-animation; for copy use copywriting.
---

# UI Design

Pick the visual direction, then implement it in code via the ui.sh design guideline system.

- **IS:** choosing visual direction (palettes, type scales, tokens, layout systems, CRO strategy, brand boards) and building or refining UI in code: one definitive design, variants compared in the browser, a semantic markup scaffold from a UI image, dark-mode and responsive retrofits, or component extraction and Tailwind canonicalization.
- **IS NOT:** deciding what should exist, action scope, consequence, or reachable states (use `product-design`); auditing existing UI without changing it (use `ui-audit`); deep typography audits (use `typography-audit`); motion design (use `ui-animation`); landing-page copy (use `copywriting`).

## Modes

Pick one mode from the user's wording; load only that mode's files:

| Mode | Dispatch when the user asks for | Load |
|------|--------------------------------|------|
| **Direction** | visual direction, palettes, fonts, tokens, "make this look premium", "pick a style", conversion strategy, a brand kit; deliverable is a spec, not code | the Direction section below |
| **Build** (default) | one design in code: "build a landing page", "create a dashboard", "add a pricing section" | [direction/aesthetic-direction.md](./direction/aesthetic-direction.md), [design-guidelines.md](./design-guidelines.md), then the applicable rule files from its index |
| **Refine** | implement an anti-slop pass: "remove AI slop", "looks vibe coded", "delete useless elements", "simplify this UI", "polish this generated page" | the Refine section below, plus the Build files |
| **Options** | variants to compare in the browser: "show me 3 hero layouts", "a few ideas for this section" | [ideas.md](./ideas.md) plus the guidelines per variant |
| **Scaffold** | semantic, unstyled markup from a screenshot, Figma export, mockup, or wireframe: "turn this screenshot into markup" | [markup-from-image.md](./markup-from-image.md) only; scaffold stays unstyled |
| **Dark mode** | dark mode onto existing UI, or a dark variant of an image: "add dark mode", "make a dark version of this image" | [add-dark-mode.md](./add-dark-mode.md); for raster images also [dark-mode-image.md](./dark-mode-image.md) (requires the `imagegen` skill, Codex) |
| **Responsive** | desktop UI across breakpoints: "make this responsive", "fix this on mobile" | [make-responsive.md](./make-responsive.md) |
| **Componentize** | extracting components or cleaning up Tailwind classes: "componentize this page", "clean up the Tailwind" | [componentize.md](./componentize.md); for cleanup also [canonicalize-tailwind.md](./canonicalize-tailwind.md) |

Direction and Build chain: for a new surface with no direction, run Direction first (or propose one inline for small surfaces), then Build. If a direction already exists in the project, go straight to Build.

## Direction mode

Output a decision set, not markup: a one-sentence visual thesis (mood, material, energy), palette as CSS variables, type pairing and scale, spacing grid, radius and depth strategy, the layout pattern for the primary surface, and for conversion pages the section sequence, CTA plan, and proof placement. Confirm that type, colour, radius, and interface language express one personality for the stated audience. Close with the track's litmus checks as the exit gate, then hand off to Build mode.

### Pick a track

| Surface | Track | Optimises for |
|---------|-------|---------------|
| Dashboards, admin panels, data tables, settings pages, internal and dev tools | [direction/product-ui.md](./direction/product-ui.md) | Information density, calm chrome, scanability, utility copy |
| Landing pages, brand sites, promotional pages, portfolios, pricing pages | [direction/marketing-ui.md](./direction/marketing-ui.md) | Visual impact, storytelling, one-CTA conversion flow |

Tie-breakers: a marketing site *for* a SaaS product is the marketing track; the app behind the login is product. Design them separately. Convert a stranger = marketing; let an operator work = product.

### Shared foundations (load with either track)

- [direction/aesthetic-direction.md](./direction/aesthetic-direction.md): AI-slop signals, restraint philosophy, reference products, polish details. Direction mode reads it after the track pick; Build and Refine load it first, with no track pick.
- [direction/design-in-code.md](./direction/design-in-code.md): low-fi ASCII wireframing and the copy-what-works workflow. Read before building a new surface from scratch.

### Marketing references (conversion pages only)

Load when the marketing track has a conversion goal (landing page, signup flow). Skip for pure brand/portfolio work and all product UI.

| File | Read when |
|------|-----------|
| [direction/cro.md](./direction/cro.md) | Persuasion tactics, social proof, page length, or a CRO plan: Cialdini's principles, proof credibility hierarchy, conversion benchmarks |
| [direction/testing.md](./direction/testing.md) | Optimising a page or planning experiments: test prioritisation, A/B vs multivariate, significance rules, heatmap insights, the canonical CTA statistics table |
| [direction/modern.md](./direction/modern.md) | Personalisation and mobile-first conversion (page speed, accessible copy, and microcopy route out to `optimise-seo` and `copywriting`) |

### Brand kit

For "create a brand kit", "generate a visual identity", or a brand direction board from a product idea, load [direction/brand-kit-prompt.md](./direction/brand-kit-prompt.md); its Rendering section covers the `imagegen` handoff (Codex, gpt-image-2) and the text-only fallback for agents without it.

## Build mode

1. Inspect the request, target files, existing design conventions, and available components.
2. Load [direction/aesthetic-direction.md](./direction/aesthetic-direction.md), then [design-guidelines.md](./design-guidelines.md) and only the applicable rule and reference files from its index.
3. Implement using the project's existing framework, component patterns, assets, and Tailwind conventions.
4. Render at representative desktop and mobile widths, then check interaction states.

Rules:

- Guideline files in this skill are the source of truth for new UI design work.
- `design-guidelines.md` is the single one-level index for `guidelines/`; it also owns the load contract, so load applicable rule files from there and do not maintain a second list here.
- Preserve user constraints unless a guideline requires asking about a design conflict.

## Refine mode

Edit the current UI rather than regenerating it. Preserve decisions that already serve the product.

1. **Delete:** remove unsupported furniture before styling: repeated claims, fake proof, decorative dividers, redundant sections, extra actions, and faux product chrome.
2. **Structure:** name the primary task or proposition, make its next action obvious, and give each remaining section one distinct job.
3. **System:** reconcile type, colour, radius, spacing, depth, and interface language with the project and audience. Replace unjustified one-offs with existing tokens.
4. **Surface:** refine hierarchy and grouping. Make existing controls and content feel owned before adding decoration.
5. **States:** restore hover, focus, pressed, disabled, loading, empty, success, and error states where applicable.
6. **Render:** inspect desktop and mobile captures at final size. Name the three strongest remaining AI tells and revise once when two or more are unearned effects, faux product framing, repeated persuasion furniture, or generic copy.

Other modes follow their loaded file: Options [ideas.md](./ideas.md), Scaffold [markup-from-image.md](./markup-from-image.md), Dark mode [add-dark-mode.md](./add-dark-mode.md), Responsive [make-responsive.md](./make-responsive.md), Componentize [componentize.md](./componentize.md).

## Quality Bar

Reference products below are calibration only; verify with this litmus checklist:

- Product UI keeps high information density without card piles, hero furniture, or marketing copy.
- Marketing UI has one primary conversion path, visible proof, and no generic SaaS gradients or stock-like imagery.
- Type, colour, radius, and interface language express one personality for the product and audience.
- Sizes, gaps, radii, weights, colours, and elevation values trace to project tokens or a documented exception; near-duplicates and arbitrary one-offs are removed.
- Hierarchy is readable at desktop and mobile widths without viewport-scaled type.
- Palette uses project tokens or a deliberate direction; no default Tailwind indigo/gray look.
- Interactive states exist for hover, focus, pressed, disabled, loading, empty, and error where applicable.
- Controls preserve stable dimensions when labels, counts, hover states, or loading text change.
- Visual assets show the actual product, place, object, state, gameplay, or person when inspection matters.
- The result looks compatible with the product's category, not copied from a reference brand.

Reference calibration:

- **Linear**: restrained palette, dense without clutter, keyboard-first product UI
- **Raycast**: dark-first polish, crisp iconography, fast-feeling interactions
- **Things 3**: calm, spacious layouts, friendly without being cute
- **OpenAI**: typography-led editorial minimalism in marketing surfaces
- **ElevenLabs**: modern AI-product clarity, confident whitespace
- **Mintlify**: docs-grade legibility, tidy navigation, quiet color
- **Family (crypto wallet)**: delightful detail and motion in small moments
- **Zed Editor**: minimal chrome, performance-feel, developer-tool austerity

## Verify

- Start the local dev server when the app requires one, and report its URL.
- Check desktop and mobile viewports; capture screenshot paths or browser tool observations.
- Judge subtle hierarchy, state, and edge treatments at the rendered size, theme, background, and platform where users encounter them. If a distinction is not visible there, it does not exist.
- Check console errors and failed network requests.
- Exercise the interaction states the Quality Bar requires.
- Scroll the first and last content past sticky or fixed headers, footers, and action bars at desktop and mobile widths. Content must not disappear beneath them, and overlapping chrome needs a visible edge or scroll cue.
- Confirm text does not overflow or overlap in buttons, cards, sidebars, and compact panels.
- List the guideline, track, and mode files loaded.

## Gotchas

- Marketing track on a product surface puts hero sections and campaign copy on dashboards, so operators can't find status or actions. product-ui.md's "Utility copy" section exists for this failure.
- Skipping `aesthetic-direction.md` in any mode that produces visuals defaults output toward generic Inter, undesigned white backgrounds, and purple gradients.
- Loading CRO references for a brand or portfolio page biases toward conversion furniture (badge strips, sticky CTAs, urgency banners) the brief never asked for.
- Replacing one slop costume with another leaves the structure untouched: swapping purple for cyan, Inter for decorative mono, or cards for glass panels is not a refinement pass.
- Quoting the references' conversion stats as promises ("this will lift conversions 34%") misrepresents them; they are directional priors for prioritising tests.
- Skipping `colors.md` in Build mode produces the stock Tailwind look: indigo accents and `gray-*` neutrals, both banned as defaults.

## Related Skills

- `ui-audit`: page-level quality and accessibility audit of the built result
- `typography-audit`: rule-level audit of existing typography; route "fix the fonts" on shipped CSS there
- `ui-animation`: motion timing, easing, and review
- `copywriting`: landing-page copy, message match, persuasion frameworks
- `product-design`: the product decision before the build (which interactions exist, action naming, reachable-state coverage); decide there, then build here
- `optimise-seo`: meta descriptions and page titles
- Taste Training (blode.co/taste-training): trains the eye these rules encode, across type, copy, craft, interaction, and motion

Maintenance only: when changing anti-slop behavior, run the three scenarios in [evaluations/refine-ai-ui.json](./evaluations/refine-ai-ui.json) as a regression rubric. Do not load them during a UI task.
