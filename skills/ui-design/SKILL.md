---
name: ui-design
description: 'Designs and builds UI end to end, from visual direction (palettes, type scales, design tokens, layout systems, landing-page CRO strategy, brand kits) to Tailwind implementation with the ui.sh design guideline system, including multiple variants with an in-browser picker, semantic markup scaffolds from screenshots, retrofitting dark mode or responsive behavior, and componentizing or canonicalizing Tailwind code. Use when asked to "build a landing page", "create a dashboard", "make this look good", "make this look premium", "pick a visual style", "design the UI for", "show me 3 hero options", "improve conversions", "create a brand kit", "turn this screenshot into markup", "add dark mode", "make a dark version of this image", "make this responsive", "fix this on mobile", "componentize this page", "clean up the Tailwind", or any prompt that designs, creates, or refines UI code. For auditing existing UI use ui-audit; for motion use ui-animation; for landing page copy use copywriting.'
---

# UI Design

Design and build UI: pick the visual direction, then implement it in code following the ui.sh design guideline system.

- **IS:** choosing visual direction (palettes, type scales, tokens, layout systems, CRO strategy, brand boards) and building or refining UI in code: one definitive design, multiple variants compared in the browser, a semantic markup scaffold from a UI image, retrofitting dark mode and responsive behavior, or extracting components and canonicalizing Tailwind classes.
- **IS NOT:** auditing existing UI quality (use `ui-audit`); deep typography audits (use `typography-audit`); motion design (use `ui-animation`); landing-page copy (use `copywriting`).

## Modes

Pick exactly one mode from the user's wording, then load only that mode's files:

| Mode | Dispatch when the user asks for | Load |
|------|--------------------------------|------|
| **Direction** | visual direction, palettes, fonts, tokens, "make this look premium", "pick a style", conversion strategy, a brand kit; the deliverable is a spec, not code | the Direction section below |
| **Build** (default) | one design in code: "build a landing page", "create a dashboard", "add a pricing section" | [design-guidelines.md](./design-guidelines.md) plus every applicable rule file |
| **Options** | several directions, options, variants, or alternatives to compare in the browser: "show me 3 hero layouts", "a few ideas for this section" | [ideas.md](./ideas.md), plus the guidelines for each variant |
| **Scaffold** | semantic, unstyled markup from a screenshot, Figma export, mockup, or wireframe: "turn this screenshot into markup" | [markup-from-image.md](./markup-from-image.md) only; the scaffold stays unstyled |
| **Dark mode** | retrofitting dark mode onto existing UI, or a dark variant of an image: "add dark mode", "make a dark version of this image" | [add-dark-mode.md](./add-dark-mode.md); for raster images also [dark-mode-image.md](./dark-mode-image.md), which requires the `imagegen` skill (Codex) |
| **Responsive** | adapting existing desktop-oriented UI across breakpoints: "make this responsive", "fix this on mobile" | [make-responsive.md](./make-responsive.md) |
| **Componentize** | extracting reusable components or cleaning up Tailwind class lists: "componentize this page", "clean up the Tailwind" | [componentize.md](./componentize.md); for class cleanup also [canonicalize-tailwind.md](./canonicalize-tailwind.md) |

Direction and Build chain naturally: when the user wants a new surface and no direction exists, run Direction first (or propose one inline for small surfaces), then Build. When a direction already exists in the project, go straight to Build.

## Direction mode

The output is a decision set, not markup: a one-sentence visual thesis (mood, material, energy), palette as CSS variables, type pairing and scale, spacing grid, radius and depth strategy, the layout pattern for the primary surface, and for conversion pages the section sequence, CTA plan, and proof placement. Close with the track's litmus checks as the exit gate, then hand off to Build mode.

### Pick a track

| Surface | Track | Optimises for |
|---------|-------|---------------|
| Dashboards, admin panels, data tables, settings pages, internal and dev tools | [direction/product-ui.md](./direction/product-ui.md) | Information density, calm chrome, scanability, utility copy |
| Landing pages, brand sites, promotional pages, portfolios, pricing pages | [direction/marketing-ui.md](./direction/marketing-ui.md) | Visual impact, storytelling, one-CTA conversion flow |

Tie-breakers: a marketing site *for* a SaaS product is the marketing track; the app behind the login is the product track; design them separately. If the page's job is to convert a stranger, it's marketing. If its job is to let an operator work, it's product.

### Shared foundations (load with either track)

- [direction/aesthetic-direction.md](./direction/aesthetic-direction.md): AI-slop signals, restraint philosophy, reference products, polish details. Read after picking a track, before proposing a direction.
- [direction/design-in-code.md](./direction/design-in-code.md): low-fi ASCII wireframing and the copy-what-works workflow. Read before building any new surface from scratch.

### Marketing references (conversion pages only)

Load when the marketing track involves a landing page, signup flow, or any page with a conversion goal. Skip for pure brand/portfolio work and for all product UI.

| File | Read when |
|------|-----------|
| [direction/cro.md](./direction/cro.md) | Choosing persuasion tactics, social proof, or page length, or writing a CRO plan: Cialdini's principles, proof credibility hierarchy, conversion benchmarks, Voice of Customer mining |
| [direction/testing.md](./direction/testing.md) | Optimising an existing page or planning experiments: test prioritisation, A/B vs multivariate, significance rules, heatmap insights, CTA statistics |
| [direction/modern.md](./direction/modern.md) | Tuning page speed, mobile-first conversion, personalisation, accessible copy, or microcopy |

### Brand kit

For "create a brand kit", "generate a visual identity", or a brand direction board from a product idea, load [direction/brand-kit.md](./direction/brand-kit.md). Rendering the final board needs the `imagegen` skill (Codex, gpt-image-2); in agents without it, deliver the direction as text plus the generated image prompt for the user to render.

## Build mode

1. Inspect the user's request, target files, existing design conventions, and available components.
2. Load [design-guidelines.md](./design-guidelines.md) plus every applicable rule file it indexes (the `guidelines/` folder).
3. Implement the UI using the project's existing framework, component patterns, assets, and Tailwind conventions.
4. Check the result across responsive breakpoints and interaction states.

Rules:

- Treat the guideline files in this skill as the source of truth for new UI design work.
- Err on the side of loading too many applicable guideline files rather than too few.
- Preserve user constraints unless a guideline explicitly requires asking about a design conflict.

Options mode follows [ideas.md](./ideas.md); Scaffold mode follows [markup-from-image.md](./markup-from-image.md); Dark mode follows [add-dark-mode.md](./add-dark-mode.md); Responsive follows [make-responsive.md](./make-responsive.md); Componentize follows [componentize.md](./componentize.md).

## Quality Bar

Calibrate taste against gold-standard product and UI design. When making judgment calls the guidelines leave open, ask what these teams would ship, and channel the craft, not the trade dress:

- **Linear**: restrained palette, information density without clutter, keyboard-first product UI
- **Raycast**: dark-first polish, crisp iconography, fast-feeling interactions
- **Things 3**: calm, spacious layouts, friendly without being cute
- **OpenAI**: typography-led, editorial minimalism in marketing surfaces
- **ElevenLabs**: modern AI-product clarity, confident use of whitespace
- **Mintlify**: docs-grade legibility, tidy navigation, quiet color
- **Family (crypto wallet)**: delightful detail and motion in small moments
- **Zed Editor**: minimal chrome, performance-feel, developer-tool austerity

A design that would look out of place beside these products is not done.

## Verify

- Check desktop and mobile layouts.
- Confirm every applicable guideline or track file was loaded and followed.

## Gotchas

- Running the marketing track on a product surface puts hero sections and campaign copy on dashboards, so operators can't find status or actions. product-ui.md's "Utility copy" section exists for exactly this failure.
- Skipping aesthetic-direction.md in Direction mode is how Inter-on-white-with-purple-gradients ships; it is the anti-slop calibration layer for both tracks.
- Loading the CRO references for a brand or portfolio page biases the design toward conversion furniture (badge strips, sticky CTAs, urgency banners) the brief never asked for.
- Quoting the references' conversion stats as promises ("this will lift conversions 34%") misrepresents them. They are directional priors for prioritising tests.
- Skipping `colors.md` in Build mode produces the stock Tailwind look: indigo accents and `gray-*` neutrals, both banned as defaults.

## Related Skills

- `ui-audit`: page-level quality and accessibility audit of the built result
- `typography-audit`: rule-level audit of existing typography; route "fix the fonts" on shipped CSS there
- `ui-animation`: motion timing, easing, and review
- `copywriting`: landing-page copy, message match, persuasion frameworks
- `optimise-seo`: meta descriptions and page titles
