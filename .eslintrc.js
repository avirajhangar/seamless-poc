module.exports = {
  root: true,
  extends: '@seamless/eslint-config',
  ignorePatterns: ['packages/', 'docs/', '**/*.min.*'],
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'warn',
      },
    },
  ],
};
