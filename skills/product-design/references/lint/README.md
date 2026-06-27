# eslint-plugin-product-design

A small, real ESLint plugin that enforces the deterministic slice of `product-design`: the rules a linter can check reliably from a single file's AST, without rendering and without product context. Judgment-level rules stay in the skill; these seven do not need a human.

This is a working package, not a snippet. It installs, it runs, and its rules are covered by tests.

## Rules

| Rule | Rule ID | Default | What it catches |
|------|---------|---------|-----------------|
| `prefer-radio-for-few-options` | `rule/control-matches-cardinality` | warn | A select with 2-3 static options that should be radios |
| `no-nested-modals` | `rule/no-nested-modals` | error | A modal opened inside another modal |
| `icon-button-accessible-name` | `rule/accessible-name-required` | error | An icon-only button with no accessible name |
| `no-design-system-override` | `rule/no-design-system-override` | off | `className` overriding a design-system component's color, radius, or shadow |
| `require-modal-body` | `rule/modal-body-scroll` | warn | A modal with content but no scrollable body container |
| `no-raw-shadow` | `rule/material-over-raw-shadow` | warn | Raw `shadow-*` utilities instead of theme-aware materials |
| `off-grid-spacing` | `rule/spacing-on-grid` | warn | Arbitrary spacing utilities off the 4px grid |

`no-design-system-override` ships off because it cannot know which elements are yours. Turn it on by listing your components (see the example config). Every rule takes options so it points at your design system, not a hardcoded one.

## Install and wire up

```bash
npm install --save-dev eslint-plugin-product-design eslint
```

Then either take the preset or configure per rule. See `eslint.config.example.js` for both forms. Formatting belongs to a faster tool: run oxfmt (oxlint) or Biome for format, and let ESLint own these JSX-semantic rules. They do not overlap.

## Run the tests

```bash
npm install
npm test
```

`npm test` runs `node --test` over `tests/rules.test.js`, which exercises each rule with valid and invalid cases through ESLint's `RuleTester`. This is the proof the rules run, and the regression net when you change one.

## Lint rule vs agent guidance: the decision tree

Use this to decide where a new product-design standard belongs. The goal is to keep deterministic checks mechanical and keep judgment in the skill with its evidence.

```
Can code identify the failure from one file's AST, without rendering?
  No  -> agent guidance (the product-design skill).
  Yes -> Can the rule avoid likely false positives?
           No  -> agent guidance.
           Yes -> Does the violation have a concrete, mechanical fix?
                    Yes -> a lint rule (add it here).
                    No  -> a warning, or agent guidance.

Needs product or codebase context (which object, what consequence)?  -> agent guidance.
Establishes a new standard or product policy?                          -> human decision first.
```

For either path, add a test or eval that can catch the regression. If a rule cannot stay reliable without many exceptions, move it back to agent guidance.

Examples of the split:
- Counting 2-3 static options is mechanical, so `prefer-radio-for-few-options` is a lint rule.
- Naming the right object and consequence for a destructive action needs product context, so it stays in the skill (`rule/name-object-scope-consequence`) and in `copywriting` for the wording.
- Detecting a nested modal is structural, so it is a lint rule. Deciding whether the second step should exist at all is judgment.
