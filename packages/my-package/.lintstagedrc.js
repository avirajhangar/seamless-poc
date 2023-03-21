module.exports = {
  '**/*.{js,ts,tsx,vue}': [
    'eslint --ext .js,.vue --fix src"',
  ],
  '*.scss': [
    'stylelint --formatter verbose --fix',
  ],
};
