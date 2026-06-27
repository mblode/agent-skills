'use strict';

const rules = {
  'prefer-radio-for-few-options': require('./rules/prefer-radio-for-few-options'),
  'no-nested-modals': require('./rules/no-nested-modals'),
  'icon-button-accessible-name': require('./rules/icon-button-accessible-name'),
  'no-design-system-override': require('./rules/no-design-system-override'),
  'require-modal-body': require('./rules/require-modal-body'),
  'no-raw-shadow': require('./rules/no-raw-shadow'),
  'off-grid-spacing': require('./rules/off-grid-spacing'),
};

const plugin = {
  meta: { name: 'eslint-plugin-product-design', version: '0.1.0' },
  rules,
};

// Flat-config preset. `no-design-system-override` ships off because it needs
// your component list to do anything; turn it on with options once configured.
plugin.configs = {
  recommended: {
    plugins: { 'product-design': plugin },
    rules: {
      'product-design/prefer-radio-for-few-options': 'warn',
      'product-design/no-nested-modals': 'error',
      'product-design/icon-button-accessible-name': 'error',
      'product-design/no-design-system-override': 'off',
      'product-design/require-modal-body': 'warn',
      'product-design/no-raw-shadow': 'warn',
      'product-design/off-grid-spacing': 'warn',
    },
  },
};

module.exports = plugin;
