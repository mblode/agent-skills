# Lint Patterns

Read when deciding whether a product-design standard belongs in a linter or this skill, or encoding a standard's deterministic slice as a lint rule in a consuming project.

Deterministic, structural, single-file checks belong in a linter; judgment that needs product context stays in this skill. These patterns are not a shippable package: each rule must point at the consuming project's own components (its `Modal`, its `Select`, its spacing scale), so encode them in that project's ESLint config, wired to its design system. The shapes below are starting points to adapt.

## Contents

- The decision tree
- Three deterministic rules worth encoding

## The decision tree

Decide where a new product-design standard belongs: keep deterministic checks mechanical, keep judgment here with its evidence.

```
Can code identify the failure from one file's AST, without rendering?
  No  -> agent guidance (this skill).
  Yes -> Can the rule avoid likely false positives?
           No  -> agent guidance.
           Yes -> Does the violation have a concrete, mechanical fix?
                    Yes -> a lint rule (encode it in the project).
                    No  -> a warning, or agent guidance.

Needs product or codebase context (which object, what consequence)?  -> agent guidance.
Establishes a new standard or product policy?                          -> human decision first.
```

For either path, add a test or eval catching the regression. If a rule needs many exceptions, move it back to agent guidance.

Examples of the split:

- Counting 2-3 static options is mechanical, so prefer-radio is a lint rule.
- Naming the right object and consequence for a destructive action needs product context: it stays here (`rule/name-object-scope-consequence`) and in `copywriting` for wording.
- Detecting a nested modal is structural: a lint rule. Whether the second step should exist is judgment.

## Three deterministic rules worth encoding

Each points at a `product-design` rule ID. Configure each against the project's own component names; none should hardcode a design system.

| Rule | Rule ID | Suggested default | What it catches |
|------|---------|-------------------|-----------------|
| prefer-radio-for-few-options | `rule/control-matches-cardinality` | warn | A select with 2-3 static options that should be radios or a segmented control |
| no-nested-modals | `rule/no-nested-modals` | error | A modal opened inside another modal |
| icon-button-accessible-name | `rule/accessible-name-required` | error | An icon-only button with no accessible name |

Keep formatting in a faster tool (oxfmt or Biome); let ESLint own these JSX-semantic rules, which do not overlap with formatting.

Implement each as an ESLint rule wired to the project's own component names through rule options: for prefer-radio-for-few-options, bail on dynamically rendered children (a `.map`, a spread) since the count is not statically known, then report only a static option count in range; for no-nested-modals, track modal-element depth and report any modal opened while already inside one.
