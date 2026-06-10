---
name: ui-design
description: Defines visual systems and design direction before code is written: colour palettes, typography scales, layout patterns, design tokens, and component styling. Two tracks: product UI (dashboards, admin panels, data-heavy SaaS) and marketing/brand landing pages, including CRO strategy, conversion benchmarks, persuasion psychology, A/B testing, and social proof patterns. Use when choosing visual direction, designing a landing page or hero section, selecting palettes and fonts, building a type scale, theming a web application, optimising landing page conversions, or asking "make this look good", "make this look premium", "design the UI for", "full-bleed hero", "pick a visual style", "improve conversions", "landing page CRO", or "add social proof". Outputs design decisions and specs, not markup. For Tailwind implementation use the `ui` skill, for auditing existing UI use `ui-audit`, for typography audits use `typography-audit`, for motion use `ui-animation`, for landing page copy use `copywriting`.
---

# UI Design

- **IS:** choosing visual direction and producing design specs: palettes, type scales, spacing and layout systems, design tokens, component styling rules, and landing-page conversion strategy.
- **IS NOT:** auditing an existing UI's quality (use `ui-audit`), deep typography auditing (use `typography-audit`), motion design and easing (use `ui-animation`), or writing the landing-page copy itself (use `copywriting`). Once a direction is decided, implementation (Tailwind markup, components, dark mode) belongs to the private `ui` skill where installed.

## Pick a track

| Surface | Track | Optimises for |
|---------|-------|---------------|
| Dashboards, admin panels, data tables, settings pages, internal and dev tools | [product-ui.md](product-ui.md) | Information density, calm chrome, scanability, utility copy |
| Landing pages, brand sites, promotional pages, portfolios, pricing pages | [marketing-ui.md](marketing-ui.md) | Visual impact, storytelling, one-CTA conversion flow |

Tie-breakers:

- A marketing site *for* a SaaS product is the marketing track; the app behind the login is the product track. Design them separately.
- If the page's job is to convert a stranger, it's marketing. If its job is to let an operator work, it's product.

## Shared foundations (load with either track)

- [aesthetic-direction.md](aesthetic-direction.md): AI-slop signals, restraint philosophy, reference products, polish details. Read after picking a track, before proposing a direction.
- [design-in-code.md](design-in-code.md): low-fi ASCII wireframing and the copy-what-works workflow. Read before building any new surface from scratch.

## Marketing references (conversion pages only)

Load when the marketing track involves a landing page, signup flow, or any page with a conversion goal. Skip for pure brand/portfolio work and for all product UI.

| File | Read when |
|------|-----------|
| [references/cro.md](references/cro.md) | Choosing persuasion tactics, social proof, or page length, or writing a CRO plan: Cialdini's principles, proof credibility hierarchy, conversion benchmarks, Voice of Customer mining |
| [references/testing.md](references/testing.md) | Optimising an existing page or planning experiments: test prioritisation, A/B vs multivariate, significance rules, heatmap insights, CTA statistics |
| [references/modern.md](references/modern.md) | Tuning page speed, mobile-first conversion, personalisation, accessible copy, or microcopy |

## Deliverable

The output of this skill is a decision set, not markup:

- Visual thesis (one sentence): mood, material, energy
- Palette (CSS variables), type pairing and scale, spacing grid, radius and depth strategy
- Layout pattern for the primary surface
- For conversion pages: section sequence, CTA plan, proof placement

Hand the spec to implementation (`ui` skill or direct coding) once decided, and close with the track's litmus checks as the exit gate.

## Gotchas

- Running the marketing track on a product surface puts hero sections and campaign copy on dashboards, so operators can't find status or actions. product-ui.md's "Utility copy" section exists for exactly this failure.
- Skipping aesthetic-direction.md is how Inter-on-white-with-purple-gradients ships; it is the anti-slop calibration layer for both tracks.
- Loading the CRO references for a brand or portfolio page biases the design toward conversion furniture (badge strips, sticky CTAs, urgency banners) the brief never asked for.
- Quoting the references' conversion stats as promises ("this will lift conversions 34%") misrepresents them. They are directional priors for prioritising tests, and the references say so.

## Related skills

- `copywriting`: landing page copy: message match, persuasion frameworks, copy quality
- `ui-audit`: accessibility, interaction, and final QA on the built result
- `typography-audit`: rule-level audit of existing typography; route "fix the fonts" on shipped CSS there
- `ui-animation`: motion timing, easing, and review for the entrance/scroll/hover motions the marketing track requires
- `optimise-seo`: meta descriptions and page titles
- `ui` (private): Tailwind implementation once design direction is decided
