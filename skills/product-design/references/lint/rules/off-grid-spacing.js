'use strict';

const SPACING_PREFIXES = [
  'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl',
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml',
  'gap', 'gap-x', 'gap-y', 'space-x', 'space-y',
  'inset', 'inset-x', 'inset-y', 'top', 'right', 'bottom', 'left',
];

/**
 * rule/spacing-on-grid
 * Arbitrary spacing values that fall off the grid (commonly 4px) read as visual
 * noise. Flag off-grid arbitrary utilities and prefer a standard one.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Flag arbitrary spacing utilities that fall off the spacing grid',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          classProps: { type: 'array', items: { type: 'string' } },
          gridBase: { type: 'number', minimum: 1 },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      offGrid:
        'Off-grid spacing: {{classes}}. Use a value that is a multiple of {{base}}px, or a standard spacing utility (rule/spacing-on-grid).',
    },
  },
  create(context) {
    const opts = context.options[0] || {};
    const classProps = opts.classProps || ['className', 'class'];
    const gridBase = opts.gridBase || 4;

    return {
      JSXAttribute(node) {
        if (
          node.name.type !== 'JSXIdentifier' ||
          !classProps.includes(node.name.name)
        ) {
          return;
        }
        if (!node.value || node.value.type !== 'Literal') return;

        const tokens = String(node.value.value).split(/\s+/).filter(Boolean);
        const offenders = [];
        for (const token of tokens) {
          const match = token.match(/^(-?[a-z][a-z-]*?)-\[(\d+(?:\.\d+)?)px\]$/);
          if (!match) continue;
          const prefix = match[1].replace(/^-/, '');
          if (!SPACING_PREFIXES.includes(prefix)) continue;
          const px = parseFloat(match[2]);
          if (px % gridBase !== 0) offenders.push(token);
        }
        if (offenders.length === 0) return;

        context.report({
          node,
          messageId: 'offGrid',
          data: { classes: offenders.join(', '), base: String(gridBase) },
        });
      },
    };
  },
};
