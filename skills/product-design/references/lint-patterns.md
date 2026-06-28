# Lint Patterns

Read when deciding whether a product-design standard belongs in a linter or in this skill, or when encoding the deterministic slice of a standard as a lint rule in a consuming project.

Deterministic, structural, single-file checks belong in a linter; judgment that needs product context stays in this skill. These patterns are not a shippable package: lint rules are not portable, because each one has to point at the consuming project's own components (its `Modal`, its `Select`, its spacing scale). Encode them in that project's ESLint config, wired to that project's design system. The shapes below are starting points to adapt.

## Contents

- The decision tree
- Three deterministic rules worth encoding
- Two example rule shapes

## The decision tree

Use this to decide where a new product-design standard belongs. The goal is to keep deterministic checks mechanical and keep judgment here with its evidence.

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

For either path, add a test or eval that catches the regression. If a rule cannot stay reliable without many exceptions, move it back to agent guidance.

Examples of the split:

- Counting 2-3 static options is mechanical, so prefer-radio is a lint rule.
- Naming the right object and consequence for a destructive action needs product context, so it stays here (`rule/name-object-scope-consequence`) and in `copywriting` for the wording.
- Detecting a nested modal is structural, so it is a lint rule. Deciding whether the second step should exist at all is judgment.

## Three deterministic rules worth encoding

Each points at a `product-design` rule ID. Configure every one against the project's own component names; none should hardcode a single design system.

| Rule | Rule ID | Suggested default | What it catches |
|------|---------|-------------------|-----------------|
| prefer-radio-for-few-options | `rule/control-matches-cardinality` | warn | A select with 2-3 static options that should be radios or a segmented control |
| no-nested-modals | `rule/no-nested-modals` | error | A modal opened inside another modal |
| icon-button-accessible-name | `rule/accessible-name-required` | error | An icon-only button with no accessible name |

Keep formatting in a faster tool (oxfmt or Biome); let ESLint own these JSX-semantic rules, which do not overlap with formatting. Visual-token lint (design-system overrides, raw shadows, off-grid spacing, modal body scroll) is not in this skill's scope: it belongs to `ui-audit` and the project's visual lint, configured against your own components.

## Two example rule shapes

Adapt these to the project's component names through rule options.

prefer-radio-for-few-options: bail on dynamically rendered children (a `.map`, a spread) because the option count is not statically known, then report when a static option count falls in range.

```js
// rule/control-matches-cardinality
module.exports = {
  meta: { type: 'suggestion', schema: [{ type: 'object', properties: {
    selectComponents: { type: 'array' }, optionComponents: { type: 'array' },
    min: { type: 'integer' }, max: { type: 'integer' },
  }, additionalProperties: false }], messages: {
    preferRadio: 'Select with {{count}} static options. Consider radio buttons or a segmented control so every choice stays visible (rule/control-matches-cardinality).',
  } },
  create(context) {
    const o = context.options[0] || {};
    const selects = o.selectComponents || ['Select', 'select'];
    const options = o.optionComponents || ['option', 'Option'];
    const min = o.min || 2, max = o.max || 3;
    return { JSXElement(node) {
      const n = node.openingElement.name;
      if (n.type !== 'JSXIdentifier' || !selects.includes(n.name)) return;
      if (node.children.some((c) => c.type === 'JSXExpressionContainer')) return; // dynamic, count unknown
      const count = node.children.filter((c) => c.type === 'JSXElement'
        && c.openingElement.name.type === 'JSXIdentifier'
        && options.includes(c.openingElement.name.name)).length;
      if (count < min || count > max) return;
      context.report({ node: node.openingElement, messageId: 'preferRadio', data: { count: String(count) } });
    } };
  },
};
```

no-nested-modals: track modal-element depth and report any modal opened while already inside one.

```js
// rule/no-nested-modals
module.exports = {
  meta: { type: 'problem', schema: [{ type: 'object', properties: {
    modalComponents: { type: 'array' } }, additionalProperties: false }], messages: {
    noNested: 'Modal nested inside another modal. Resolve the first, use one multi-step surface, or move the second step inline (rule/no-nested-modals).',
  } },
  create(context) {
    const modals = (context.options[0] || {}).modalComponents || ['Modal', 'Dialog'];
    let depth = 0;
    const isModal = (node) => node.openingElement.name.type === 'JSXIdentifier'
      && modals.includes(node.openingElement.name.name);
    return {
      JSXElement(node) { if (!isModal(node)) return; if (depth > 0) context.report({ node: node.openingElement, messageId: 'noNested' }); depth += 1; },
      'JSXElement:exit'(node) { if (isModal(node)) depth -= 1; },
    };
  },
};
```
