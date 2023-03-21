const seamlessRc = require('./../../.seamlessrc.json');

module.exports = {
    root: true,
    extends: [
      '@seamless/eslint-config',
      'plugin:vue/essential',
      '@vue/typescript/recommended',
      '@vue/prettier',
      '@vue/prettier/@typescript-eslint',
      'plugin:@seamless/vue/essential',
    ],
    plugins: ['@seamless/vue'],
    env: {
      browser: true,
    },
    parserOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 2020,
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      '@seamless/vue/require-tenantid-name-prefix': [
        'error',
        {
          tenantId: seamlessRc.tenantId,
        },
      ],
      '@seamless/vue/require-tenantid-vue-set': [
        'error',
        {
          tenantId: seamlessRc.tenantId,
        },
      ],
    },
    overrides: [
      {
        files: ['*.js'],
        rules: {
          '@typescript-eslint/no-var-requires': 'warn',
          '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
      },
    ],
  };
