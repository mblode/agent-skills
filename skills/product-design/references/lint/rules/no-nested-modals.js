'use strict';

/**
 * rule/no-nested-modals
 * A modal opened from within a modal breaks focus trapping, escape-key order,
 * and layering, and hides the original context.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow a modal nested inside another modal',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          modalComponents: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noNested:
        'Modal nested inside another modal. Resolve the first, use a single multi-step surface, or move the second step inline (rule/no-nested-modals).',
    },
  },
  create(context) {
    const opts = context.options[0] || {};
    const modalComponents = opts.modalComponents || ['Modal', 'Dialog'];
    let depth = 0;

    function isModal(node) {
      const name = node.openingElement.name;
      return name.type === 'JSXIdentifier' && modalComponents.includes(name.name);
    }

    return {
      JSXElement(node) {
        if (!isModal(node)) return;
        if (depth > 0) {
          context.report({ node: node.openingElement, messageId: 'noNested' });
        }
        depth += 1;
      },
      'JSXElement:exit'(node) {
        if (isModal(node)) depth -= 1;
      },
    };
  },
};
