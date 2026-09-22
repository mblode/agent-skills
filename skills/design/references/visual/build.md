# Direction and Build

Choosing the visual system and implementing it in code, plus the narrower build-side passes (Extract, Options, Scaffold, Retrofit, Componentize). Audit mode must not load this file: an audit that reads design guidance turns into a redesign.

## Contents

- Before choosing styles
- Direction
- Extract
- Build
- Options, Scaffold, Retrofit, Componentize
- Quality bar
- Reference calibration
- Verify a build
- Gotchas

## Before choosing styles

Read the project's existing `design.md`, `design-system.md`, or brand guide when present. Check its scope and source against the implemented theme; report drift instead of creating a second competing specification. Brand positioning or an identity change is out of scope: name the open brand question and apply the identity the company already has.

## Direction

Choose the visual system; write no markup. Output a decision set: a one-sentence visual thesis (mood, material, energy), palette as CSS variables, type pairing and scale, spacing grid, radius and depth strategy, the layout pattern for the primary surface, and for conversion pages the section sequence, CTA plan, and proof placement. Close against the Quality bar, then hand off to Build.

| Surface | Track | Optimises for |
|---------|-------|---------------|
| Dashboards, admin panels, data tables, settings, internal and dev tools | `product-ui.md` | Information density, calm chrome, scanability, utility copy |
| Landing pages, brand sites, promotional pages, portfolios, pricing pages | `marketing-ui.md` | Visual impact, storytelling, one-CTA conversion flow |

A marketing site for a SaaS product is the marketing track; the app behind the login is product. Convert a stranger = marketing; let an operator work = product. `aesthetic-direction.md` loads with either track; `design-in-code.md` before building a new surface from scratch. Conversion references (`conversion.md`, `conversion-testing.md`, `conversion-mobile.md`) load only when the marketing track has a conversion goal. A brand kit or direction board loads `brand-kit.md`.

Direction then Build for a new surface with no direction (or propose one inline for small surfaces). If the project already has a direction, go straight to Build. Extract chains ahead of both on an existing codebase: a direction chosen without knowing what the project already uses is a second design system.

## Extract

Record what an existing codebase already decided as a durable `design-system.md` the other modes consume: which theme source the build actually honours, the scales as used rather than as declared, the component inventory, the conventions in force, and the documented exceptions. Values, not prose. Load `design-system-extract.md` only. Check three scale values against computed styles in Verify mode and record any disagreement rather than quietly picking a side.

## Build

Implement one design in code with restraint: the smallest thing that serves the product.

1. Inspect the request and target files. Load the project's `design-system.md` if one exists; otherwise inspect the relevant token and component sources. Run a full Extract only when requested or when inconsistent sources block the build.
2. Load `aesthetic-direction.md` and `foundations.md`, then only the sections of `components.md`, `sections.md`, `form-controls.md`, `tailwind.md`, `responsive.md`, and `assets.md` that match concrete elements in the request. A hero loads Heading Groups; any page section loads Landing Pages; a dashboard card or list item loads Surfaces.
3. Implement with the project's existing framework, components, assets, and conventions.
4. Verify the build (below).

Build to the guideline and know what will audit it. Where a guideline sets a stricter build default than a rule's floor (touch targets: 48 build, 44 audit), build to the guideline. When the user's input conflicts with a guideline marked **ask-user**, flag it: say what the guideline recommends and why the input does not fit, offer a concrete alternative, and let the user choose.

## Options, Scaffold, Retrofit, Componentize

| Pass | Dispatch when | Load |
|---|---|---|
| Options | variants to compare in the browser: "show me 3 hero layouts" | `options.md` plus the guidelines per variant |
| Scaffold | semantic, unstyled markup from a screenshot, Figma export, mockup, or wireframe | `scaffold-markup.md` only; the scaffold stays unstyled |
| Retrofit | one dimension added to existing UI: "add dark mode", "make this responsive", "fix this on mobile" | Dark Mode in `foundations.md`; `responsive.md` |
| Componentize | extracting components or cleaning up classes | Componentize and Canonicalize Tailwind in `tailwind.md` |

Options variants must diverge: each declares a named axis (layout, density, personality, interaction model) and no two share an axis position. Name them for the direction ("Quiet", "Editorial", "Dense"), never "Option A/B/C". Every variant fully works, with product-shaped copy and no dead buttons.

"Feel native on mobile" is not Retrofit: it runs the `mobile-*` audit rules and Motion mode's press and hover gating. Retrofit's "fix this on mobile" is layout.

## Quality bar

- Product UI keeps high information density without card piles, hero furniture, or marketing copy.
- Marketing UI has one primary conversion path, visible proof, and no generic SaaS gradients or stock-like imagery.
- Type, colour, radius, and interface language express one personality for the product and audience.
- Sizes, gaps, radii, weights, colours, and elevation values trace to project tokens or a documented exception.
- Hierarchy is readable at desktop and mobile widths without viewport-scaled type.
- Palette uses project tokens or a deliberate direction; no default Tailwind indigo or gray look.
- Interactive states exist for hover, focus, pressed, disabled, loading, empty, and error where applicable.
- Controls keep stable dimensions when labels, counts, hover states, or loading text change.
- Visual assets show the actual product, place, object, state, or person when inspection matters.
- The result fits the product's category without copying a reference brand.

## Reference calibration

Calibration only; verify against the Quality bar. **Linear** (restrained, dense without clutter, keyboard-first), **Raycast** (dark-first polish, crisp iconography), **Things 3** (calm, spacious, friendly without being cute), **OpenAI** (typography-led editorial minimalism), **ElevenLabs** (AI-product clarity, confident whitespace), **Mintlify** (docs-grade legibility, quiet colour), **Family** (delight in small moments), **Zed** (minimal chrome, developer-tool austerity).

## Verify a build

- Start the dev server when the app needs one and report its URL. Capture desktop and mobile (Verify mode owns the session and the probes).
- Judge hierarchy, state, and edge treatments at the rendered size, theme, and background where users meet them. A distinction not visible there does not exist.
- Check console errors and failed requests; exercise the interaction states the Quality bar requires.
- Scroll the first and last content past sticky headers, footers, and action bars at both widths: nothing disappears beneath them.
- Confirm text does not overflow in buttons, cards, sidebars, and compact panels.
- List the pass, track, and reference files loaded.

## Gotchas

- Marketing track on a product surface puts hero sections and campaign copy on dashboards, so operators cannot find status or actions. `product-ui.md`'s utility-copy section exists for this failure.
- Loading conversion references for a brand or portfolio page biases toward conversion furniture (badge strips, sticky CTAs, urgency banners) the brief never asked for.
- Quoting the conversion references' statistics as promises ("this will lift conversions 34%") misrepresents them; they are directional priors for prioritising tests.
- Skipping Colors in `foundations.md` produces the stock Tailwind look: indigo accents and `gray-*` neutrals, both banned as defaults.
