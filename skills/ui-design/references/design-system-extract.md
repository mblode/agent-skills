# Design System Extract

Reads an existing codebase and writes down what it already decided, as a durable artifact the other modes consume. Run it once per project, and again when the theme or the component library moves.

This exists because the guidelines defer to the project constantly and nothing establishes what the project is. `guidelines/colors.md` says "use it only if the project already does" three times in its first three lines. Build has no way to answer that, so it answers with a plausible default, and `slop-token-drift` catches the mismatch afterward as a density heuristic rather than a conformance check.

## What the artifact is for

| Consumer | Uses it to |
|---|---|
| Build | Compose from what exists instead of inventing a second Button, and pick values from the real scale rather than a plausible one |
| Audit | Judge drift against the project's actual scale. This is the one design-system file the audit load contract permits, because it records what the project decided rather than what it should decide |
| `ui-verification` | Check the written scale against computed styles on a rendered page, which is what catches a tokens file that no longer matches the shipped CSS |

The load-contract distinction is the whole reason this is an artifact and not a guideline. Prescription stays out of an audit; project state does not.

## Extract only what changes a decision

An inventory nobody acts on is a second README. Five things earn their place:

1. **Where the theme lives, and which source wins.** A `@theme` block, a `tailwind.config.*`, a CSS custom-property sheet, and a published tokens package can all be present at once, with the build honouring one. Name the authoritative one and how you established it, because every value below is only as good as that answer.
2. **The scales actually in use, not the ones defined.** Read the values that appear in components, not just the theme's declarations. A theme with twelve radius steps where the codebase uses three has a three-step ladder; recording twelve invites Build to reach for a step no surface uses. Cover spacing, radius, shadow, type sizes and weights, and the neutral family (`zinc` and `slate` and `neutral` are different decisions, and the guideline bans two of the common defaults).
3. **The component inventory.** What exists, where it lives, and what it is called. This is the highest-value half: shipping a second Button is a worse outcome than any amount of token drift, and it is the failure a fresh session makes by default.
4. **The conventions in force.** The class-merging helper, the variant library, the icon set, the dark-mode mechanism (class, data attribute, or media query), and whether components are compound or prop-driven. These decide whether generated code reads as native or as a graft.
5. **What is deliberately off-system.** A one-off value with a documented reason, a vendor widget that cannot be themed, a legacy surface nobody is migrating. Recording it stops the next audit re-flagging a decision someone already made, which is the fastest way for an audit to lose its reader.

Everything else is discoverable in seconds when it is needed, and belongs in the codebase rather than in a summary of it.

## Procedure

```text
Extract progress:
- [ ] 1. Locate every theme source; establish which one the build actually honours
- [ ] 2. Read the scales out of component usage, not only out of the theme declarations
- [ ] 3. Inventory components: name, path, and the variants each exposes
- [ ] 4. Record the conventions (merging helper, variant library, icons, dark-mode mechanism)
- [ ] 5. Record the documented exceptions and their reasons
- [ ] 6. Write the artifact; point the repo's agent instructions at it
- [ ] 7. Spot-check three values against the rendered app before trusting the file
```

Step 7 is the one to keep. A tokens file is a claim about the build, and a build step can override it: a value in the theme that no computed style ever shows is a value Build will use and the browser will discard. Hand the artifact to `ui-verification` and check three of its scale values against computed styles on a real page. Anything that disagrees goes in the artifact as a discrepancy, not silently corrected, because which of the two is wrong is a repo decision.

## Writing it

Default to `design-system.md` at the repo root, beside the agent instruction files, and add a pointer from `AGENTS.md` or `CLAUDE.md` so it loads without anybody remembering it exists (the `agents-md` skill owns that wiring). A file nothing points at is invisible to the next session, which is the same failure as an unlinked reference inside a skill.

Write values, not prose. "Radius ladder: `sm` 4px, `md` 8px, `lg` 12px; cards use `lg`, inputs use `md`" is usable. "The project uses a consistent radius scale" is not, and is also unfalsifiable when it stops being true.

Date nothing and version nothing. The artifact describes the current tree, and the tree is the source of truth; a stale artifact is corrected by re-running the extract, not by reading a changelog inside it.

## When to re-run

- The theme source changes, or a second one appears.
- A component library is adopted, replaced, or forked.
- An audit reports drift findings the artifact does not explain, which usually means the artifact is behind rather than the code being wrong.

Re-running is cheap and replaces the file wholesale. Do not maintain it by hand: a hand-edited artifact drifts from the codebase in exactly the way it exists to prevent.
