'use strict';

/**
 * rule/accessible-name-required
 * An icon-only button with no accessible name is unusable by screen readers
 * and ambiguous under load.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require an accessible name on icon-only buttons',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          buttonComponents: { type: 'array', items: { type: 'string' } },
          nameProps: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      needsName:
        'Icon-only button has no accessible name. Add a visible label, aria-label, or title (rule/accessible-name-required).',
    },
  },
  create(context) {
    const opts = context.options[0] || {};
    const buttonComponents = opts.buttonComponents || [
      'button',
      'Button',
      'IconButton',
    ];
    const nameProps = opts.nameProps || ['aria-label', 'aria-labelledby', 'title'];

    return {
      JSXElement(node) {
        const name = node.openingElement.name;
        if (name.type !== 'JSXIdentifier' || !buttonComponents.includes(name.name)) {
          return;
        }

        const attrs = node.openingElement.attributes;
        const hasNameProp = attrs.some(
          (attr) =>
            attr.type === 'JSXAttribute' &&
            attr.name.type === 'JSXIdentifier' &&
            nameProps.includes(attr.name.name),
        );
        if (hasNameProp) return;

        // Ignore whitespace-only text children; keep real text, elements, expressions.
        const children = node.children.filter(
          (child) => !(child.type === 'JSXText' && child.value.trim() === ''),
        );

        // Empty button with no name, or a button whose only children are icon
        // elements (no text), is icon-only. A dynamic child ({label}) might be
        // text, so bail to avoid false positives.
        if (children.length === 0) {
          context.report({ node: node.openingElement, messageId: 'needsName' });
          return;
        }
        if (children.some((child) => child.type === 'JSXExpressionContainer')) {
          return;
        }
        if (children.every((child) => child.type === 'JSXElement')) {
          context.report({ node: node.openingElement, messageId: 'needsName' });
        }
      },
    };
  },
};
