'use strict';

/**
 * rule/no-design-system-override
 * Overriding a design-system component's color, radius, shadow, or focus via
 * className forks the system and breaks theming. Layout utilities are allowed.
 *
 * Requires configuration: list your design-system components in `components`.
 * Without it, the rule is inert (it cannot know which elements are yours).
 *
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        "Disallow className overriding a design-system component's color, radius, or shadow",
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          components: { type: 'array', items: { type: 'string' } },
          classProps: { type: 'array', items: { type: 'string' } },
          forbiddenPatterns: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      override:
        'className overrides the design system on <{{component}}>: {{classes}}. Use the component API or a design token, not a per-instance override (rule/no-design-system-override).',
    },
  },
  create(context) {
    const opts = context.options[0] || {};
    const components = opts.components || [];
    if (components.length === 0) return {};

    const classProps = opts.classProps || ['className', 'class'];
    const patterns = (
      opts.forbiddenPatterns || [
        '^bg-',
        '^rounded',
        '^shadow',
        '^ring-',
        '^border-[a-z]+-\\d',
      ]
    ).map((source) => new RegExp(source));

    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier' || !components.includes(node.name.name)) {
          return;
        }
        const classAttr = node.attributes.find(
          (attr) =>
            attr.type === 'JSXAttribute' &&
            attr.name.type === 'JSXIdentifier' &&
            classProps.includes(attr.name.name),
        );
        // Only static string class lists are checked.
        if (!classAttr || !classAttr.value || classAttr.value.type !== 'Literal') {
          return;
        }
        const tokens = String(classAttr.value.value).split(/\s+/).filter(Boolean);
        const offenders = tokens.filter((token) =>
          patterns.some((re) => re.test(token)),
        );
        if (offenders.length === 0) return;

        context.report({
          node: classAttr,
          messageId: 'override',
          data: { component: node.name.name, classes: offenders.join(', ') },
        });
      },
    };
  },
};
