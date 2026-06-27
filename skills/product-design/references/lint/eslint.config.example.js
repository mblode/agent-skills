// Drop-in flat config showing how to wire eslint-plugin-product-design into a
// consuming app. Copy the relevant block into your own eslint.config.js.
//
// Formatting is a separate, faster concern: run oxfmt (oxlint) or Biome for
// format and let ESLint own these JSX-semantic rules. They do not overlap.

const productDesign = require('eslint-plugin-product-design');

module.exports = [
  // Option A: take the recommended preset as-is.
  productDesign.configs.recommended,

  // Option B: configure rules to your own design system. This block overrides
  // the preset for your component files. Replace the component names with yours.
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { 'product-design': productDesign },
    rules: {
      'product-design/prefer-radio-for-few-options': [
        'warn',
        { selectComponents: ['Select'], optionComponents: ['Select.Option'] },
      ],
      'product-design/no-nested-modals': [
        'error',
        { modalComponents: ['Modal', 'Dialog', 'Sheet'] },
      ],
      'product-design/icon-button-accessible-name': [
        'error',
        { buttonComponents: ['button', 'Button', 'IconButton'] },
      ],
      // Turn this on by naming your design-system components and the visual
      // utilities they own. Layout utilities (m-, p-, w-, grid) stay allowed.
      'product-design/no-design-system-override': [
        'warn',
        {
          components: ['Button', 'Card', 'Badge', 'Input'],
          forbiddenPatterns: ['^bg-', '^rounded', '^shadow', '^ring-'],
        },
      ],
      'product-design/require-modal-body': [
        'warn',
        { modalComponents: ['Modal', 'Dialog'], bodyComponent: 'Body' },
      ],
      'product-design/no-raw-shadow': 'warn',
      'product-design/off-grid-spacing': ['warn', { gridBase: 4 }],
    },
  },
];
