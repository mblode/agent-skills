---
name: branding
description: Defines distinctive brand positioning, identity systems, and creative direction grounded in the product. Use when asked to "build a brand", "rebrand", "define our identity", "make this recognizable", or "create brand guidelines". For a UI build use ui-design; for final copy use copywriting; for feature priorities use product-judgment.
---

# Branding

Make the product recognizable for a reason. Deliver a brand direction people can apply across real surfaces, with a clear account of what stays fixed and what can vary.

- **IS:** brand positioning, identity direction, brand refreshes, campaign relationships, and systems for repeatable expression.
- **IS NOT:** feature selection (`product-judgment`), interaction semantics (`product-design`), website implementation (`ui-design`), final campaign copy (`copywriting`), or generating finished media. Use the host's media tools when the user requests assets.

## The stance

- **Identity grows from a product truth.** Start with what the product enables, for whom, and the evidence behind its promise. A borrowed aesthetic cannot supply a missing position.
- **Distinctiveness comes from a few committed choices.** Prefer a recognizable combination of type, composition, image treatment, language, or motion over a collage of fashionable effects. Minimalism is one possible expression; warmth, density, exuberance, and ornament can be equally disciplined.
- **Recognition compounds.** Preserve recognizable assets unless the brief and evidence justify replacing them. A refresh should solve an identified weakness rather than erase history for novelty.
- **The experience carries the promise.** A confident campaign cannot compensate for confusing onboarding or unreliable delivery. Identify that mismatch instead of covering it with stronger adjectives.
- **A brand is a system that survives use.** The chosen direction must work outside its hero mockup, in ordinary content and difficult formats, and be usable by someone other than its author.

## References

| File | Read when |
|---|---|
| [System proof](references/system-proof.md) | Turning a direction into guidelines, reviewing a brand across surfaces, or deciding whether templates or tooling are needed |
| [Inspiration and boundaries](references/inspiration.md) | The user invokes Linear, Vercel, or Done Bear, or asks where these opinions come from |

`evals/evals.json` is for maintainers changing this skill, never a dependency of a branding task.

## Workflow

### 1. Establish what should become recognizable

Read the product's current positioning, actual experience, existing identity, and relevant customer language. Look for an existing `design.md`, `design-system.md`, or brand guide before proposing new rules; the filename alone establishes neither scope nor authority. Identify the audience, promise, proof, category conventions, and assets people already recognize. Separate approved decisions from proposals and references from authority.

For a new brand, propose the missing decisions and label assumptions. For a refresh, name the specific recognition, relevance, or application problem. Ask only for missing information that changes the direction; do not invent market research.

### 2. Choose a creative idea

Translate the position into an organizing idea with visible consequences. Explain the connection between the idea and the product. Define the emotional register and what the brand deliberately avoids.

When the direction is unsettled, compare a few materially different concepts, not palette swaps. Give each a one-line thesis and a material tradeoff; if the same thesis describes both, the concepts need more separation. Hold content, data, formats, and fidelity comparable so stronger photography or shorter copy does not decide the winner. Recommend one against the brief. When a direction is already approved, develop it without reopening the strategy.

References supply techniques and questions. Translate what makes a reference work; do not default to its logo, palette, typeface, motifs, or personality. Explicit user choices take precedence over this skill's preferences.

### 3. Specify the recognizable system

Make concrete decisions for the elements that carry this identity: mark or wordmark direction, typography roles, color roles, composition, imagery, verbal character, and motion where it contributes. Explain how they reinforce the same idea. Preserve existing specifications when the task is narrower than a rebrand.

Distinguish core identity from campaign variation. Name what authors may change and what would make an application cease to belong. Provide usable examples and counterexamples, not an adjective list. Let `copywriting` own the detailed voice chart and final text; let `ui-design` own component tokens and implementation.

### 4. Prove it in the formats that matter

Read [System proof](references/system-proof.md). Exercise the identity on representative touchpoints, including a routine or constrained one: a dense announcement, small avatar, email, product state, printed item, or other format the brief actually needs.

When comparing directions, show them side by side in the same representative formats and use the same difficult content. If a comparison is only written, describe the matched proof applications without claiming a visual test.

Compare applications together for family resemblance and separately for legibility and purpose. Assess recognition without relying only on the logo. Treat this as a design review, not evidence of customer recognition unless people were actually tested.

When rendering tools are available and the task calls for visuals, make representative applications and inspect them. If only a written direction is produced, label it a proposed system and name the remaining visual proof; do not describe imagined renders as verified.

### 5. Make it usable

Carry the chosen thesis and tradeoff into the guidelines or implementation handoff. Deliver the recommended direction, its product rationale, the defining choices, applications or their review status, and the few rules necessary to reproduce it. Scale the document to the request.

If repeated production is the problem, prefer improving approved templates and bounded editing controls before commissioning a new identity or a general generator. Keep taste decisions with the designer and automate repetition after the system works.

Save requested guidelines in the consuming project's durable location, outside the installed skill. When asked for `design.md`, use the existing format and distinguish brand intent from verified implementation tokens; link the canonical theme or asset sources rather than creating a competing inventory. Publishing that file at a website URL is a separate delivery step. Preserve existing brand decisions and clearly identify proposed changes. A branding request does not itself authorize publication, a paid generation run, or a production rebrand; follow the user's actual action scope.

## Gotchas

- **A successful reference becomes the answer.** "Polished like Vercel" turns into monochrome developer branding for an unrelated audience. Carry over coherence and execution quality; derive the expression from this product.
- **The hero works, the system fails.** A motif dominates a poster but makes a small card illegible. Test the constrained application before calling it a system.
- **More generation disguises missing direction.** Many attractive images can share no repeatable identity. Select and refine a direction, then make variation controllable.
- **A production problem becomes a rebrand.** Overflowing headlines in approved templates need content limits, layout behavior, and review, not a new logo.

## Related skills

`product-judgment` decides what deserves building. `product-design` settles interactions. `ui-design`, `ui-animation`, and `typography-audit` implement or examine their specialties; `copywriting` writes in the chosen voice. If a sibling is unavailable, deliver the decision contract and identify the remaining execution work instead of assuming it ran.
