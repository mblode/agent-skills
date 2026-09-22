# Rule template

One template for every rule in this folder. Copy the shape below, delete the sections you do not need, and delete this header block.

Sections marked REQUIRED must be present in every rule file. Everything else is OPTIONAL, and an empty optional section is worse than an absent one.

---

## REQUIRED: frontmatter

Exactly these keys, in this order. No others. `related` is the only omissible one.

```yaml
---
title: Rule title, short and descriptive
id: <category>-<kebab-slug>, identical to the filename without .md
category: a11y | async | dark-i18n | focus | forms | interaction | layout | microcopy | mobile | nav | perf | slop | states | type
defaultTier: release-blocker | fix-this-sprint | backlog
detect: static | rendered | rubric
related: other-rule-id, other-rule-id
---
```

`detect` records how the rule is checked, and replaces the old split into separate rule folders:

- `static`: readable from source with grep, AST, or file presence.
- `rendered`: needs the built output, a real viewport, or computed style.
- `rubric`: scored 1-5 against the anchor table in the rule's own file, because the defect does not reduce to a boolean.

Omit `related` entirely when there is nothing to link. Values are bare ids, never paths and never filenames.

## REQUIRED: H2 matching the title

The first body heading is an H2 whose text is identical to `title`.

## REQUIRED: the failure paragraph

One paragraph immediately under the H2 naming the user-facing failure, not the best practice. What does the user see, and why does it diverge from what the code intended? Put any threshold and its source inline, for example "44x44px per WCAG 2.5.5".

An optional second paragraph carries nuance only: common misreadings, scope limits, or what the rule does not claim.

## REQUIRED: at least one of the three evidence forms

A rule file must carry at least one of the following. Most carry exactly one. Adding all three to a rule that only needs a code pair is padding.

### Form A: an incorrect / correct pair

The default, and the right choice for most rules.

**Incorrect (what is wrong and why):**

```tsx
// Minimal failing example: only the lines that violate the rule.
```

**Correct (what the fix looks like):**

```tsx
// Same example, fixed. The diff against the incorrect block should be obvious.
```

One pair per rule. Never restate the same fix in a second pair.

### Form B: a `## Detection` section

For rules where finding the defect is the hard part and the fix is obvious.

One framing sentence, one command, one paragraph naming the legitimate pattern that also matches:

```markdown
## Detection

Search for <what>, in <where>; a hit is confirmed when <the deciding fact>.

```bash
rg -nP '<pattern>' -g '*.tsx' -g '*.jsx' src/
```

<The correct code this also matches, and how to tell them apart.>
```

Every rule carries this section. The false-positive paragraph is the part that cannot be derived: a pattern without it is a grep anyone could write, and the rule exists because someone already learned which correct code it fires on.

**Put every condition inside one pattern, not in a pipeline.** A `-U` multiline match piped through `rg` or `rg -v` filters output *lines*, so an element whose attributes or class string Prettier wrapped loses the deciding line: the filter either drops a correct element's exemption and reports it, or drops the token that would have confirmed it and reports nothing. Use lookaheads within the element instead. Piping is fine when each output line is already one self-contained value, as after `rg -oP`.

Where a defect genuinely needs the rendered page (a measured width, a computed style, a spatial relationship), say so in this section and set `detect: rendered` rather than writing a grep that cannot decide it.

### Form C: a threshold table

For rules that reduce to a number.

| Tier | Condition | Severity |
|---|---|---|
| pass | observable condition with a number | none |
| warn | observable condition with a number | MEDIUM |
| fail | observable condition with a number | HIGH |

For a `detect: rubric` rule, use anchors instead of thresholds:

| Score | Anchor |
|---|---|
| 5 | Concrete best-in-class anchor. |
| 4 | Clear pass with minor polish available. |
| 3 | Ambiguous or uneven, should be improved. |
| 2 | Clear user-facing friction. |
| 1 | Broken or misleading experience. |

---

## OPTIONAL: `## Fix`

Only when the fix needs more than the correct half of a code pair: a migration path, an API choice, or a link to canonical docs.

## OPTIONAL: `## Default tier and overrides`

Only when the tier genuinely moves by surface. A table that shifts everything one step in the obvious direction is noise.

| Surface | Tier |
|---|---|
| Sign-in / Sign-up | usually one tier higher |
| Checkout | usually one tier higher |
| Marketing landing | usually one tier lower |
| Internal admin | usually one tier lower |

## OPTIONAL: `## Examples`

Only where the wording is the deliverable. A `microcopy-*` rule needs the actual bad and good strings shown, because a prose description of a string is not the string. Everywhere else the code pair already carries it.

## OPTIONAL: `## Defer-to`

Only when another tool owns the finding: Lighthouse for runtime measurement, axe for computed WCAG rules, an ESLint plugin for write-time prevention. Link out rather than duplicating their check.

## OPTIONAL: `## Suppression`

Only when the rule has a meaningful false-positive rate. Show the ignore comment carrying this rule's id and a reason.

---

Never add a `## Contents` index. These headings are the whole file shape, and a rule file long enough to need a table of contents is two rules.
