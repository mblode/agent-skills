'use strict';

/**
 * rule/control-matches-cardinality
 * Suggest radio buttons (or a segmented control) when a select renders only
 * 2-3 static, mutually exclusive options, so every choice stays visible.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Suggest radio buttons when a select has a small number of static options',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          selectComponents: { type: 'array', items: { type: 'string' } },
          optionComponents: { type: 'array', items: { type: 'string' } },
          min: { type: 'integer', minimum: 1 },
          max: { type: 'integer', minimum: 1 },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferRadio:
        'Select with {{count}} static options. Consider radio buttons or a segmented control so every choice stays visible without a click (rule/control-matches-cardinality).',
    },
  },
  create(context) {
    const opts = context.options[0] || {};
    const selectComponents = opts.selectComponents || ['Select', 'select'];
    const optionComponents = opts.optionComponents || ['option', 'Option'];
    const min = opts.min || 2;
    const max = opts.max || 3;

    return {
      JSXElement(node) {
        const name = node.openingElement.name;
        if (name.type !== 'JSXIdentifier' || !selectComponents.includes(name.name)) {
          return;
        }
        // Bail on any dynamically rendered children (a map, a spread, a variable):
        // the option count is not statically known and the suggestion would misfire.
        const hasDynamic = node.children.some(
          (child) => child.type === 'JSXExpressionContainer',
        );
        if (hasDynamic) return;

        const options = node.children.filter(
          (child) =>
            child.type === 'JSXElement' &&
            child.openingElement.name.type === 'JSXIdentifier' &&
            optionComponents.includes(child.openingElement.name.name),
        );
        if (options.length < min || options.length > max) return;

        context.report({
          node: node.openingElement,
          messageId: 'preferRadio',
          data: { count: String(options.length) },
        });
      },
    };
  },
};
