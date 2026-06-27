'use strict';

/**
 * rule/material-over-raw-shadow
 * Raw shadow utilities ignore the theme and break in dark mode. Use the design
 * system's theme-aware surface or material classes instead.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow raw shadow utilities in favor of theme-aware materials',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          classProps: { type: 'array', items: { type: 'string' } },
          allow: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      rawShadow:
        'Raw shadow utility: {{classes}}. Use a theme-aware surface or material class so elevation follows the theme (rule/material-over-raw-shadow).',
    },
  },
  create(context) {
    const opts = context.options[0] || {};
    const classProps = opts.classProps || ['className', 'class'];
    const allow = opts.allow || ['shadow-none'];

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
        const raw = tokens.filter(
          (token) => /^shadow(-|$)/.test(token) && !allow.includes(token),
        );
        if (raw.length === 0) return;

        context.report({
          node,
          messageId: 'rawShadow',
          data: { classes: raw.join(', ') },
        });
      },
    };
  },
};
