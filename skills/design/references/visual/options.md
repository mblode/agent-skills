# Ideas

Use when the user wants to compare several implementations of the same UI in the browser and pick a winner. Variants live in the real source files behind a URL parameter, so promoting a choice is deleting the branches that lost.

## Contents

- [Start](#start)
- [Workflow](#workflow)
- [Divergence rules](#divergence-rules)
- [Guardrails](#guardrails)
- [Verify](#verify)

## Start

If Options mode already ran in this conversation or project, reset before generating anything new. Treat the currently selected UI as the baseline, delete branches from earlier rounds that lost, and delete params that no longer control anything. Stacking a new round on an unreset one produces variants of variants, which the user cannot judge.

## Workflow

1. **Name the decision points.** A decision point is one question the user will answer, such as `Hero style` or `Pricing layout`. Reuse existing names where variants are already named. Two or three per round is the ceiling; every extra one multiplies the combinations the user has to hold in their head.

2. **Choose the options.** Three per decision, up to five when the space is genuinely wide. Past five the comparison dilutes. When the current implementation is in the running it is option 1, carries `(current)` in its label, and is the param's default, so the unmodified URL shows today's UI.

3. **Build the variants in place,** against the divergence rules below.

4. **Switch on a query param,** one per decision point, read where the page is already assembled. In a Next.js App Router page this needs no client component:

   ```tsx
   export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
     const { hero = 'minimal', pricing = 'cards' } = await searchParams
     return (
       <>
         {hero === 'bold' ? <HeroBold /> : hero === 'editorial' ? <HeroEditorial /> : <HeroMinimal />}
         {pricing === 'table' ? <PricingTable /> : <PricingCards />}
       </>
     )
   }
   ```

5. **Add a picker of plain links,** fixed to one edge, visually neutral so it reads as scaffolding rather than part of the design being judged. Links, not component state: `<a href="?hero=bold">`. The back button then works and every combination is a URL the user can send you.

6. **Ask with `AskUserQuestion`.** One question per decision point, labels matching the picker exactly with the `(current)` suffix intact, custom input left enabled. Give each option one line on when it wins and one on what it costs, and do not pre-pick a favourite. If the user asks which you would choose, answer from the product's personality and how often the surface is used, not from aesthetics alone.

7. **Promote,** in this order so no intermediate save leaves the app broken: inline the selected implementation and delete the conditional, then the dead variant components and their imports, then the picker and the `searchParams` plumbing that only existed to feed it. For another round, stop after the first of those and keep the picker.

## Divergence rules

Three tints of the same idea waste the round: the user learns nothing by flipping between them.

- Each option states its axis in a phrase: layout, density, personality, motion, or interaction model. Two options differing only in accent colour, spacing, or copy are one option. Replace one with a real alternative.
- Sharing the project's tokens is not convergence. Every option should look like it could ship tomorrow, so keep using the existing palette, type scale, and radii.
- Every option fully works: real interactions, real motion, product-shaped copy. A variant with lorem ipsum or a dead button loses on execution and teaches nothing about the direction it stood for.

## Guardrails

- All variant work happens in existing source files. No standalone preview route, no scratch file, no added dependency. Variant switching is a string compare; a control-panel library is a worse answer that also has to be uninstalled.
- Preserve the other params when building picker links. A bare `?hero=bold` silently resets the pricing choice, and the user reads that as a broken variant rather than a lost param.
- Moving the picker is the one layout call worth making: if a variant occupies the edge it sits on, move it to the opposite one. Nothing else about its appearance is worth spending time on.

## Verify

- Flip through every option yourself before showing the user: each renders, each interaction responds, console is clean, no duplicate `id` attributes in the surviving markup.
- Desktop and mobile both hold.
- After promotion, `git grep` finds no picker, no orphaned variant components, and no leftover `searchParams` reads.
