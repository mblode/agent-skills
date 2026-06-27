'use strict';

/**
 * rule/modal-body-scroll
 * Long modal content needs a scroll container (for example Modal.Body) so the
 * body scrolls while header and footer stay reachable. Without it, content
 * pushes the actions off-screen.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require a scrollable body container inside a modal with content',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          modalComponents: { type: 'array', items: { type: 'string' } },
          bodyComponent: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      needsBody:
        'Modal has content but no scrollable body container. Wrap content in {{body}} so it scrolls and the actions stay reachable (rule/modal-body-scroll).',
    },
  },
  create(context) {
    const opts = context.options[0] || {};
    const modalComponents = opts.modalComponents || ['Modal', 'Dialog'];
    const bodyComponent = opts.bodyComponent || 'Body';

    function nameMatchesBody(jsxName, modalName) {
      if (jsxName.type === 'JSXMemberExpression') {
        return (
          jsxName.property.type === 'JSXIdentifier' &&
          jsxName.property.name === bodyComponent
        );
      }
      if (jsxName.type === 'JSXIdentifier') {
        return (
          jsxName.name === bodyComponent || jsxName.name === modalName + bodyComponent
        );
      }
      return false;
    }

    function hasBodyDescendant(node, modalName) {
      for (const child of node.children || []) {
        if (child.type !== 'JSXElement') continue;
        if (nameMatchesBody(child.openingElement.name, modalName)) return true;
        if (hasBodyDescendant(child, modalName)) return true;
      }
      return false;
    }

    return {
      JSXElement(node) {
        const name = node.openingElement.name;
        if (name.type !== 'JSXIdentifier' || !modalComponents.includes(name.name)) {
          return;
        }
        const hasElementChild = node.children.some(
          (child) => child.type === 'JSXElement',
        );
        if (!hasElementChild) return; // empty modal, nothing to scroll
        if (hasBodyDescendant(node, name.name)) return;

        context.report({
          node: node.openingElement,
          messageId: 'needsBody',
          data: { body: `${name.name}.${bodyComponent}` },
        });
      },
    };
  },
};
